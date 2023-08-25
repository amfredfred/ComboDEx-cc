import { Box, Button, CircularProgress, FormControlLabel, Grid, Input, Radio, Switch } from "@mui/material";
import { useWeb3Modal } from "@web3modal/react";
import { ArrowDropDown, ArrowRight, DoubleArrow, Equalizer, GasMeter, Settings, SettingsApplications, Timelapse } from "@mui/icons-material";
import {
    useAccount, useContractRead,
    useContractReads,
    useNetwork,
    useProvider,
    useToken,
    useBalance,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi";
import { useADDR } from "../../../Ethereum/Addresses";
import { useEffect, useState } from 'react'
import { cut, fmWei, isAddress, percentageof, precise, priceDifference, strEqual, sub, toBN, toWei } from "../../../Helpers";
import { motion } from 'framer-motion'
import { COMBO_ABIs } from '../../../Ethereum/ABIs/index.ts'
import { NumCompact } from "../../../Helpers";
import { toast } from 'react-toastify'
import useDecentralizedExchange from "../../../Hooks/useDecentralizedExchamge";
import { useLocalStorage } from "usehooks-ts";
import { IMultiPathTranactionBuillder, ISnipperParams, Params } from "../../../Defaulds";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { wait } from "@testing-library/user-event/dist/utils";
import DropDown from "../../../Components/Dropdown";
dayjs.extend(relativeTime);

export default function ManualSnipper(props: ISnipperParams) {
    const { settings, setparams, dexes } = props
    const { chain, } = useNetwork()
    const ADDR = useADDR(chain?.id);
    const ProviderInstance = useProvider()
    const { open, isOpen } = useWeb3Modal()
    const { isConnected, address } = useAccount()
    const [routeOutputs, setRouteOutputs] = useState<any>()
    const [buttonText, setButtonText] = useState('Transact')
    const auto = (): boolean => params?.snipper?.autoFetchLastPair
    const [params, setstore] = useLocalStorage<typeof Params>('@Params', Params)
    const { dex } = useDecentralizedExchange(params?.snipper?.dex)
    const [selectedPair, setSelectedPair] = useState({ transactionCount: 0 })
    const [baseTokenBalance, setBaseTokenBalance] = useState<string | number>(0)

    const { data: Pairs, isSuccess: isPairValid, status } = useContractRead({
        abi: COMBO_ABIs,
        address: ADDR['PRICE_ORACLEA'],
        args: [params?.snipper?.pair],
        functionName: 'getTokensFromPair',
        enabled: Boolean(params?.snipper?.pair),
        watch: Boolean(params?.snipper?.pair),
    })

    const { data: token0 } = useToken({ address: (Pairs as any)?.[0], enabled: Boolean((Pairs as any)?.[0]) })
    const { data: token1 } = useToken({ address: (Pairs as any)?.[1], enabled: Boolean((Pairs as any)?.[1]) })
    const { data: token0Balance } = useBalance({ address, token: token0?.address, watch: true, enabled: Boolean(address && params?.snipper?.pair) })
    const { data: token1Balance } = useBalance({ address, token: token1?.address, watch: true, enabled: Boolean(address && params?.snipper?.pair) })
    const { data: token0InPool } = useBalance({ address: params?.snipper?.pair, token: token0?.address, watch: true, enabled: Boolean(token0?.address && params?.snipper?.pair) })
    const { data: token1InPool } = useBalance({ address: params?.snipper?.pair, token: token1?.address, watch: true, enabled: Boolean(token1?.address && params?.snipper?.pair) })

    const [selectedTrade, setSelectedTrade] = useState<any>({
        swapping: {
            from: token0Balance,
            to: token1Balance
        },
        tradeType: token0Balance?.symbol,
        tradeAmount: precise(Math.random() * 2),
        tokenInfo: token0
    })

    const handleTradePathToggle = (payload?: any) => setSelectedTrade((p: any) => ({
        ...p, swapping: { ...p.swapping, from: p.swapping.to, to: p.swapping.from }
    }))

    const PriceOracleContracts = {
        abi: COMBO_ABIs, address: ADDR['PRICE_ORACLEA'], functionName: "priceInToken",
        args: [token0?.address, token1?.address, dex.router, dex.FACTORY],
        watch: Boolean(token0?.address && token1?.address),
        enabled: Boolean(token0?.address && token1?.address)
    }

    const { data: tokenPriceInToken, } = useContractRead(PriceOracleContracts)

    PriceOracleContracts.args = [
        [dex.router],
        [selectedTrade?.swapping?.from?.address, selectedTrade?.swapping?.to?.address],
        toWei(Number(Number.isNaN(selectedTrade.tradeAmount) ? 0 : selectedTrade.tradeAmount), selectedTrade?.swapping?.from?.decimals)
    ]

    const { data: tokenAllowance } = useContractRead({
        address: selectedTrade?.swapping?.from?.address,
        abi: COMBO_ABIs,
        functionName: 'allowance',
        args: [address, ADDR['PRICE_ORACLEA']],
        watch: Boolean(address),
        enabled: Boolean(address)
    })

    const routeOutput = useContractRead({
        ...PriceOracleContracts,
        functionName: "getRouteOutputs",
        watch: isPairValid,
        enabled: isPairValid
    })

    const predictedFuturePrice = /*predicting future price*/ useContractRead({
        ...PriceOracleContracts,
        functionName: "predictFuturePrices",
        watch: isPairValid,
        enabled: isPairValid
    })

    const { data: lastPair } = useContractRead({
        functionName: 'getLastPair',
        abi: COMBO_ABIs,
        address: ADDR['PRICE_ORACLEA'],
        watch: isPairValid,
        args: [dex?.FACTORY],
        enabled: auto(),
        cacheTime: 0
    })

    const approveTransaction = useContractWrite({
        mode: 'recklesslyUnprepared',
        functionName: 'approve',
        abi: COMBO_ABIs,
        address: selectedTrade?.swapping?.from?.address,
        args: [ADDR['PRICE_ORACLEA'],
            toWei(selectedTrade.tradeAmount, selectedTrade?.swapping?.from?.decimals)]
    })

    const prepareSwap = usePrepareContractWrite({
        functionName: 'swap',
        abi: COMBO_ABIs,
        address: ADDR['PRICE_ORACLEA'],
        args: [
            [selectedTrade?.swapping?.from?.address, selectedTrade?.swapping?.to?.address],
            toWei(selectedTrade?.tradeAmount, selectedTrade?.swapping?.from?.decimals),
            toWei(routeOutputs?.RoutOutputs, selectedTrade?.swapping?.to?.decimals),
            dex.router,
            120
        ],
        overrides: {
            value: strEqual(selectedTrade?.swapping?.from?.address, ADDR['WETH_ADDRESSA']) ? toWei(selectedTrade?.tradeAmount) : 0,
        },
        cacheTime: 0,
        enabled: isPairValid
    })

    const swapTransaction = useContractWrite(prepareSwap.config)

    const waitTransaction = useWaitForTransaction({
        hash: swapTransaction?.data?.hash || approveTransaction?.data?.hash,
        enabled: Boolean(approveTransaction?.data?.hash || swapTransaction?.data?.hash),
    })

    const handleSwap = async () => {
        return setstore(p => p = { ...p, waitlist: { ...p.waitlist, visible: true } })
        if (!strEqual(selectedTrade?.swapping?.from?.address, ADDR['WETH_ADDRESSA']))
            if (selectedTrade?.swapping.from?.symbol !== chain?.nativeCurrency?.symbol)
                if (Number(fmWei(tokenAllowance as any)) <= 0) {
                    approveTransaction?.write?.()
                    toast.warn("Approve snipper to spend your ".concat(selectedTrade?.swapping?.from?.symbol).concat(' on your behalf'))
                    swapTransaction?.write?.()
                    return
                }

        if (prepareSwap?.isError) toast.error((prepareSwap?.error as any)?.reason, { toastId: "ERROR_TOAST" })
        swapTransaction?.write?.()
    }

    useEffect(() => {

        const outPuts = fmWei(routeOutput?.data as any, selectedTrade?.swapping?.to?.decimals)
        const future = fmWei(predictedFuturePrice?.data as any, selectedTrade?.swapping?.to?.decimals)

        setRouteOutputs((o: any) => o = {
            ...o,
            RoutOutputs: outPuts,
            FuturePrice: future
        })

        !(auto() && isAddress(lastPair as string)) || setparams('pair', lastPair as string);

        if (prepareSwap?.data?.request?.data)
            (async () => {
                const estimatedgas = await ProviderInstance?.estimateGas(prepareSwap?.data?.request?.data as any)
                const gasInfo = await ProviderInstance.getFeeData()
                const estimatedgasForTransaction = Number(fmWei(estimatedgas as any)) * Number(fmWei(prepareSwap?.data?.request?.gasLimit as any))
            })()

    }, [lastPair, params.snipper.autoFetchLastPair, routeOutput?.status, predictedFuturePrice?.status, selectedTrade, prepareSwap?.data?.request, dex])


    useEffect(() => {
        const TRANSACTING_TOAST_ID = 'TRANSACTING';

        if (swapTransaction?.data && !swapTransaction?.isError) {
            toast.promise(
                swapTransaction?.data.wait,
                { error: 'error', success: 'Swap Successful', pending: 'Wait, Swapping...' },
                { toastId: TRANSACTING_TOAST_ID }
            );
            swapTransaction?.reset()
        }

        if (swapTransaction?.isError || swapTransaction?.error) {
            swapTransaction?.isError && toast.error(
                'Transaction Failed: '.concat((swapTransaction?.error as any)?.reason),
                { toastId: TRANSACTING_TOAST_ID }
            );
            swapTransaction?.reset()
        }

        if (swapTransaction?.data) {
            (async () => {
                setButtonText('working...')
                await swapTransaction?.data?.wait().then(async () => {
                    if (!params?.snipper?.inPosition) {
                        setparams('lastSellPrice', 0)
                        await wait(100)
                        setparams('inPosition', true)
                        await wait(100)
                        setparams('lastBuyTime', Date.now())
                        await wait(100)
                        setparams('lasBuyPrice', Number(fmWei(tokenPriceInToken as any, token1?.decimals)))
                    }
                    else {
                        setparams('lasBuyPrice', 0)
                        await wait(100)
                        setparams('lastSellPrice', Number(fmWei(tokenPriceInToken as any, token0?.decimals)))
                        await wait(100)
                        setparams('inPosition', false)
                        await wait(100)
                        setparams('lastBuyTime', 0)
                    }
                    setButtonText('transact')
                })
            })();
        }

        // Check if token needs to be approved first 
        if (!strEqual(selectedTrade?.swapping?.from?.address, ADDR['WETH_ADDRESSA']))
            if (Number(fmWei(tokenAllowance as any)) <= 0) {
                setButtonText('Approve')
            }
            else { setButtonText('Transact') }
        else setButtonText('Transact')

        return () => {
            (async () => {
                if (Boolean(address)) {
                    const baseBalance = await ProviderInstance.getBalance(String(address));
                    setBaseTokenBalance(o => o = precise(fmWei(String(baseBalance))));
                }
                if (Boolean(params?.snipper?.pair)) {
                    if (chain?.testnet)
                        return setSelectedPair(p => ({ ...p, transactionCount: "Testnet detected!" as any }));
                    else if (chain?.testnet === undefined)
                        return setSelectedPair(p => ({ ...p, transactionCount: "Connect Wallet!" as any }));
                    const poolTnxCount = await ProviderInstance.getTransactionCount(params?.snipper?.pair);
                    setSelectedPair(p => ({ ...p, transactionCount: Number(poolTnxCount) }));
                }
            })();
        }
    }, [tokenPriceInToken, token1, selectedTrade, tokenAllowance]);

    useEffect(() => {
        setSelectedTrade((p: any) => ({
            ...p, swapping: {
                ...p.swapping,
                from: { ...token0, ...token0Balance },
                to: { ...token1, ...token1Balance }
            }
        }))
    }, [token0Balance, token1Balance, params?.snipper?.pair])

    // console.log(String(priceImpact?.data), "PRICE IMPACT!!!")

    const DexSelector = <div className="space-between isolated-container" style={{ zIndex: 20 }}>
        <Button
            onClick={() => dexes(o => !o)}
            variant='contained'
            style={{ padding: '.2rem' }}
            className={`primary-button dark-button ${!dex?.NAME && 'error'}`}>
            <img src={dex?.ICON} alt={dex?.SYMBOL} className="icon" />&nbsp;{dex?.NAME ?? `Invalid DEX`}&nbsp;<ArrowDropDown />
        </Button>
    </div>

    const Variants = <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="info-container">
        <div className="only-two-flexed">
            <div className="two-flexed-inner">

                <div className="table-small">
                    <div className="table-small-inner">
                        <span >PRICE</span>
                        <span>{fmWei(tokenPriceInToken as any, token1?.decimals)}</span>
                        <span>- - -</span>
                    </div>
                    <div className="table-small-inner">
                        <span>FUTURE PRICE</span>
                        <span>
                            {selectedTrade.swapping?.from?.symbol}  /  {selectedTrade.swapping?.to?.symbol}
                        </span>
                        <span>
                            {predictedFuturePrice?.isFetching ? <CircularProgress color="inherit" size={10} /> : NumCompact(routeOutputs?.FuturePrice)}
                        </span>
                    </div>
                    <p className="paragraph small-text">
                        Your position
                    </p>
                    <div className="table-small-inner">
                        <span>IN POSITION</span>
                        <span>
                            {params?.snipper?.inPosition ? "Yes" : "No"}
                        </span>
                        <span>
                            {
                                !params?.snipper?.lastBuyTime ? "Not in position"
                                    : dayjs(Date.now()).to(params?.snipper?.lastBuyTime)
                            }
                        </span>
                    </div>
                    <div className="table-small-inner" style={{ opacity: params?.snipper?.lasBuyPrice ? 1 : .2 }}>
                        <span>LAST BUY PRICE</span>
                        <span>
                            {params?.snipper?.lasBuyPrice}
                        </span>
                        <span >- - -</span>
                    </div>
                    <div className="table-small-inner" style={{ opacity: params?.snipper?.takeProfit ? 1 : .2 }}>
                        <span>SELLING PRICE</span>
                        <span>
                            {percentageof(params?.snipper?.takeProfitPercentage + 100, params?.snipper?.lasBuyPrice)}
                        </span>
                        <span >
                            %{params?.snipper?.takeProfitPercentage}
                        </span>
                    </div>
                    <div className="table-small-inner">
                        <span>POT. PROFIT (now)</span>
                        <span>{sub(fmWei(tokenPriceInToken as any, token1?.decimals), params?.snipper?.lasBuyPrice)}</span>
                        <span>
                            {
                                priceDifference(
                                    Number(fmWei(tokenPriceInToken as any, token1?.decimals)) - params?.snipper?.lasBuyPrice,
                                    params?.snipper?.lasBuyPrice
                                ).percentage
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>

    const PoolInfo = <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="info-container">
        <div className="only-two-flexed">
            <div className="two-flexed-inner">
                <div className="table-small">
                    <div className="table-small-inner">
                        <span > {token0InPool?.symbol} IN POOL </span>
                        <span></span>
                        <span>{token0InPool?.formatted}</span>
                    </div>
                    <div className="table-small-inner">
                        <span > {token1InPool?.symbol} IN POOL </span>
                        <span></span>
                        <span>{token1InPool?.formatted}</span>
                    </div>
                    <div className="table-small-inner">
                        <span className="orangered"> Watching... <CircularProgress dir='rtl' color="info" size={10} /></span>
                        <span></span>
                        <span>---</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>

    const Transactions = <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="info-container">
        <div className="only-two-flexed">
            <div className="two-flexed-inner">
                <div className="table-small">
                    <div className="table-small-inner">
                        <span> TOTAL TRANSACTIONS </span>
                        <span></span>
                        <span>{selectedPair?.transactionCount}</span>
                    </div>
                    <div className="table-small-inner">
                        <span className="orangered">MORE DATA </span>
                        <span></span>
                        <span>COMING SOON... </span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>

    const ExTendedContainer = <div className="expanded-container">
        <Box className="box-navigation">
            <div className="space-between" style={{ width: '100%', }}>
                <div className="space-between">
                    <Button variant='contained' disabled={params?.snipper?.dataDisplay === 'variants'} onClick={() => setparams('dataDisplay', 'variants')} className="box-navigation-btn" >
                        Variants
                    </Button>
                    <Button disabled={params?.snipper?.dataDisplay === 'pool'} onClick={() => setparams('dataDisplay', 'pool')} className="box-navigation-btn" >
                        Pool
                    </Button>
                    <Button disabled={params?.snipper?.dataDisplay === 'transactions'} onClick={() => setparams('dataDisplay', 'transactions')} className="box-navigation-btn"  >
                        Transactions
                    </Button>
                </div>
            </div>
        </Box>

        {!isPairValid ? <h3 className="headline-3" style={{ padding: '2rem', textAlign: 'center' }}>NOT ENOUGH DATA</h3> :
            <Box>
                <h3 className="headline-3   space-between" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    {token0?.symbol}/{token1?.symbol}
                    <div className="space-between" style={{ gap: 0 }}>
                        <a target="_blank" className="green" href={`${chain?.blockExplorers?.default?.url}/address/${params?.snipper?.pair}`}>&nbsp;{cut(params?.snipper?.pair)}</a>
                        <ArrowRight />
                    </div>
                </h3>

                {params?.snipper?.dataDisplay === 'variants' && Variants}
                {params?.snipper?.dataDisplay === 'pool' && PoolInfo}
                {params?.snipper?.dataDisplay === 'transactions' && Transactions}
            </Box>
        }
    </div>

    return <Grid className="dash" style={{ borderRadius: 20 }}>
        <Box className={`dash-lin-box relative-container expanable ${params?.snipper?.mode}`}>
            <div className="contained">
                <div className="space-between" style={{ width: '100%', }}>
                    <div className="space-between">
                        <FormControlLabel control={<Switch onChange={() => setparams('autoFetchLastPair', !auto())} checked={auto()} />} label="Auto" />
                        <CircularProgress color="inherit" size={10} />
                    </div>
                    {DexSelector}
                    <Settings className="primary-button" onClick={() => { typeof settings === 'function' && settings(o => !o) }} />
                </div>
                <Box className="box-input-area">
                    <Box className="input-area">
                        <div className="filter-input-wrapper space-between" style={{ width: '100%', marginBlock: '1rem' }}>
                            <input className="input-reading"
                                onChange={(e: any) => setparams('pair', e.target.value)}
                                onFocus={() => setparams('autoFetchLastPair', false)}
                                value={params?.snipper?.pair}
                                placeholder='Pair Address... 0x0...' />
                        </div>

                        <div className="toggle-slide-switch" style={{ width: '100%', marginTop: '1rem', }}>
                            <Button
                                className="secondary-button active-side"
                                variant="contained"
                                style={{ width: '100%' }}
                                // disabled={selectedTrade.tradeType === 'buy'}
                                onMouseDown={() => setparams('autoFetchLastPair', false)}
                                onClick={() => handleTradePathToggle('from')}>
                                <Radio checked={selectedTrade.swapping?.from?.formatted > 0} />
                                {cut(selectedTrade?.swapping?.from?.symbol, 'right')?.concat?.(isConnected ? precise(selectedTrade?.swapping?.from?.formatted ?? 0, 3) as any : '? ? ?')}
                            </Button>
                        </div>

                        <div className="space-between" style={{ marginTop: '1rem' }}>
                            <Button >
                                {baseTokenBalance !== 0 ? `${chain?.nativeCurrency?.symbol}${baseTokenBalance}`
                                    : <span className='danger-color '>connect wallet</span>}
                            </Button>

                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={() => setparams('triangular', !params?.snipper?.triangular)}
                                        checked={params?.snipper?.triangular}
                                    />
                                }
                                label="Triangular"
                            />
                        </div>

                        <Box className="alone-contianer " style={{ padding: '.4rem', marginTop: '.5rem' }}>
                            <div className="space-between" style={{ gap: 0, paddingInline: '.6rem' }}>
                                <Input
                                    disableUnderline
                                    type="number"
                                    value={selectedTrade.tradeAmount}
                                    maxRows={1}
                                    // onFocus={() => setparams('autoFetchLastPair', false)}
                                    error={String(selectedTrade.tradeAmount).length > 15 ? true : false}
                                    className="input-reading transparent-input"
                                    onChange={(i: any) => setSelectedTrade((a: any) => ({ ...a, tradeAmount: String(selectedTrade.tradeAmount).length <= 15 && i.target.valueAsNumber }))}
                                    placeholder={`${selectedTrade.tokenInfo?.symbol} 0.00`}
                                />
                                {/* <div className="space-between"> */}
                                <Button
                                    onClick={() => setSelectedTrade((a: any) => ({ ...a, tradeAmount: selectedTrade?.swapping?.from?.formatted ?? 0 }))}
                                >  100%  </Button>
                                <label className="input-label">{cut(selectedTrade?.swapping?.from?.symbol, 'right')}</label>
                                {/* </div> */}
                            </div>
                        </Box>
                    </Box>

                    {/* <motion.div className="alone-contianer space-between" style={{ padding: '.4rem', marginTop: '.5rem' }}> */}
                    <DropDown
                        title={
                            <div className=" space-between" style={{ width: '100%' }}>
                                <div className="trade-route " style={{ marginBottom: 0, justifyContent: 'left', gap: '.5rem' }}>
                                    <span className="output-values">
                                        <span>{NumCompact(selectedTrade?.tradeAmount)}</span>
                                        <span>{cut(selectedTrade?.swapping?.from?.symbol, 'right')}</span>
                                    </span>
                                    <span className="output-values">
                                        {routeOutput?.isLoading ? <CircularProgress color="inherit" size={10} /> : precise(/*NumCompact(*/routeOutputs?.RoutOutputs/*)*/, 6)}
                                        <span>{cut(selectedTrade?.swapping?.to?.symbol, 'right')}</span>
                                    </span>
                                </div>
                                <span className="output-values">
                                    <GasMeter color="warning" style={{ fontSize: 16 }} />
                                    10<span>{"Gwei"}</span>
                                </span>
                            </div>
                        }
                    >
                    </DropDown>
                    {/* </motion.div> */}

                    <Box className="input-area" >
                        {
                            isConnected ?
                                <Button variant="contained"
                                    onClick={handleSwap}
                                    className={`primary-button ${waitTransaction?.isLoading && 'bg-red'}`} style={{ width: ' 100%', marginTop: '1.4rem' }}>
                                    {buttonText}{waitTransaction?.isLoading && <CircularProgress color="success" size={10} />}
                                </Button>
                                : <Button onClick={() => open()}
                                    style={{ width: ' 100%', marginTop: '1.4rem' }}
                                    variant="contained"
                                    disabled={isOpen} className=" primary-button">
                                    {isOpen ? "Connecting..." : "Connect Your Wallet"}
                                </Button>
                        }
                    </Box>
                </Box>
            </div >

            {params?.snipper?.mode === 'mini' && ExTendedContainer
            }
        </Box >
    </Grid >
}
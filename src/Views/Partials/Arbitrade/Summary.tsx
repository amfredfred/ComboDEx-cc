import { Add, ArrowRight, CurrencyExchange } from "@mui/icons-material";
import { Button, CircularProgress, Box, Grid } from "@mui/material";
import { useLocalStorage } from "usehooks-ts";
import { Params, IParams, IArbitradeRouteBuilder, IContractRead, IDex, ITokenInfo, IMultiPathTranactionBuillder } from "../../../Defaulds";
import { useEffect, useState } from "react";
import { usePrepareContractWrite, useNetwork, useWaitForTransaction, useContractWrite, useAccount, useContractRead, useProvider, useSigner, useSignMessage, useBalance } from "wagmi";
import { PRICE_ORACLE } from "../../../Ethereum/ABIs/index.ts"
import { useADDR } from "../../../Ethereum/Addresses";
import { fmWei, toWei, strEqual, precise, sub } from "../../../Helpers";
import { Web3Button } from "@web3modal/react";
import { toast } from 'react-toastify'
import { ethers } from "ethers";
import { motion } from 'framer-motion'


export default function Summary(props: { onShowDexes: IArbitradeRouteBuilder['onShowDexes'] }) {

    const [{ arbitrade }, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const [ButtonText, setButtonText] = useState<string>("Start Transaction")
    const [ReqOutput, setReqOutput] = useState(0)
    const { isConnected, address, } = useAccount()
    const provider = useProvider()
    const { chain } = useNetwork()
    const ADDR = useADDR(chain?.id);
    const signer = useSigner({
        chainId: chain?.id,
    })

    const fromBalance = useBalance({
        address,
        enabled: Boolean(address && arbitrade?.dexes?.[0]?.paths?.[0]?.address),
        token: arbitrade?.dexes?.[0]?.paths?.[0]?.address as any
    })

    const Builder = {
        _paths: [], _pathLengths: [], _routes: [], _inputes: [], _minOutputs: [], _deadline: 100,
    } as IMultiPathTranactionBuillder

    const Transactable = arbitrade?.dexes?.map((dex, index: number) => {
        Builder['_paths'].push(...(dex?.paths?.map(path => path?.address) || []))
        Builder['_pathLengths'].push(dex?.paths?.length)
        Builder['_routes'].push(dex.router)
        Builder['_inputes'].push(toWei(index === 0 ? arbitrade?.amountIn : arbitrade?.dexes?.[index - 1]?.output) as number)
        Builder['_minOutputs'].push(toWei(arbitrade?.dexes?.[index]?.output) as number)
        Builder['_deadline'] = 20 // in seconds, contract has the current timestamp
        return Builder
    })

    const prepareSwap = usePrepareContractWrite({
        functionName: 'multiPathSwap',
        abi: PRICE_ORACLE,
        address: ADDR['PRICE_ORACLEA'],
        args: (Object.values(Transactable?.[0] || [])),
        overrides: {
            // gasLimit: toWei(0.004, 'gwei') as ethers.BigNumber,
            // gasPrice: toWei(10, 'gwei') as ethers.BigNumber,
            // maxFeePerGas: toWei(20, 'gwei') as ethers.BigNumber,
            // maxPriorityFeePerGas: toWei(25, 'gwei') as ethers.BigNumber,
            value:
                strEqual(arbitrade?.dexes?.[0]?.paths?.[0]?.symbol?.slice(-3),
                    chain?.nativeCurrency?.symbol?.slice(-3)) ? toWei(arbitrade?.amountIn, arbitrade?.dexes?.[0]?.paths?.[0]?.decimals) : 0
        },
        cacheTime: 0,
        enabled:
            Boolean(Number(arbitrade?.dexes?.[0]?.paths?.length) > 1 &&
                Number(arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths?.length) > 1) &&
            Boolean(Number(fromBalance?.data?.formatted) >= Number(arbitrade?.amountIn) && Number(arbitrade?.amountIn) > 0),
        staleTime: 0
    })

    const sendSwap = useContractWrite(prepareSwap?.config)

    const { data: tokenAllowance } = useContractRead({
        address: arbitrade?.dexes?.[0]?.paths?.[0]?.address as any,
        abi: PRICE_ORACLE,
        functionName: 'allowance',
        args: [address, ADDR['PRICE_ORACLEA']],
        enabled: !strEqual(arbitrade?.dexes?.[0]?.paths?.[0]?.address, ADDR?.WETH_ADDRESSA),
        cacheTime: 0,
        staleTime: 0,
        watch: true,
    })

    const { write: approve, data: approvalData, isLoading: isApproving } = useContractWrite({
        mode: 'recklesslyUnprepared',
        functionName: 'approve',
        abi: PRICE_ORACLE,
        address: arbitrade?.dexes?.[0]?.paths?.[0]?.address as any,
        args: [ADDR['PRICE_ORACLEA'], toWei(5e10)],
    })

    const waitTransaction = useWaitForTransaction({
        hash: approvalData?.hash || sendSwap?.data?.hash,
        enabled: Boolean(approvalData?.hash || sendSwap?.data?.hash),
    })

    const hasAllowance = () => {
        if (!strEqual(arbitrade?.dexes?.[0]?.paths?.[0]?.address, ADDR?.WETH_ADDRESSA))
            return Number(fmWei(tokenAllowance as any, arbitrade?.dexes?.[0]?.paths?.[0]?.decimals))
        return 1
    }

    const handleSendTransaction = async () => {
        if (hasAllowance() <= 0)
            return approve()
        sendSwap?.write?.()
    }

    const requiredOuput = useContractRead({
        functionName: "getRouteOutputs",
        abi: PRICE_ORACLE,
        // address: ADDR['PRICE_ORACLEA'] as any,
        // args: [[arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.router],
        // arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths?.map((p: ITokenInfo) => p?.address)?.reverse() || [],
        //     toWei(arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.output ?? arbitrade?.dexes?.[0]?.output,
        //     arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths?.[arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths.length - 1]?.decimals
        // )],
        // watch: true,
        // cacheTime: 0,
        // staleTime: 0,
        // enabled: Number(arbitrade?.dexes?.[0]?.paths?.length) > 
        enabled: false
    })

    useEffect(() => {
        const TRANSACTING_TOAST_ID = 'TRANSACTING';

        if (hasAllowance() <= 0 && arbitrade?.dexes?.[0]?.paths?.[0]?.address)
            setButtonText("Approve ".concat(arbitrade?.dexes?.[0]?.paths?.[0]?.symbol as string))
        if (isApproving)
            setButtonText('Approving...'.concat(arbitrade?.dexes?.[0]?.paths?.[0]?.symbol as string))

        if (waitTransaction.isLoading)
            toast.promise(
                sendSwap?.data?.wait as any || approvalData?.wait as any,
                { error: 'An Error Occured', success: 'Successful', pending: 'Wait, Working...' },
                { toastId: TRANSACTING_TOAST_ID }
            );
        // if (isWritePrepareError) {
        //     toast.warn('This transaction is likely going to fail...', {
        //         'autoClose': false,
        //         'position': 'bottom-center',
        //         toastId: TRANSACTING_TOAST_ID
        //     })
        // }

        (async () => {
            if (approvalData?.hash as any || sendSwap?.data?.hash as any) {
                const feeData = await provider.getFeeData()
                const functionGasFees = await provider.estimateGas(approvalData?.hash as any || sendSwap?.data?.hash as any)
                const txGasPrice = functionGasFees.mul(feeData.maxFeePerGas as any)
                console.log(txGasPrice, 'EST> FEES')
            }
        })();

        if (requiredOuput?.isFetched && requiredOuput?.data) {
            const reqOutput = fmWei(requiredOuput?.data as any, arbitrade?.dexes?.[0]?.paths[0]?.decimals)
            setReqOutput(reqOutput as any)
        }

        return () => {
            setButtonText('Send transaction')
            sendSwap?.reset()
        }
    }, [
        tokenAllowance,
        sendSwap?.error,
        sendSwap?.isError,
        prepareSwap.isError,
        sendSwap?.data,
        isApproving,
        arbitrade?.dexes?.[0]?.paths?.[0]?.symbol,
        requiredOuput?.status
    ])

    useEffect(() => {

        if (arbitrade?.settings?.auto) {
            // const contract = new ethers.Contract(ADDR['PRICE_ORACLEA'], PRICE_ORACLE, signer?.data as any)
            setInterval(async () => {
                if (sendSwap?.isLoading) return
                // const tnx = await contract.multiPathSwap(...Object.values(Transactable?.[0] || []),
                //     { value: strEqual(arbitrade?.dexes?.[0]?.paths?.[0]?.symbol?.slice(-3), chain?.nativeCurrency?.symbol?.slice(-3)) ? toWei(arbitrade?.amountIn) : 0 })
                // console.log(tnx)
                // handleSendTransaction()
            }, 10000)
        }

    }, [arbitrade?.settings?.auto, signer?.data, sendSwap?.isLoading])

    const manualSigningPanel = (
        <motion.div
            className="dash-main-box box-stats  transparent space-between padding-none" style={{ boxShadow: 'none', flexWrap: 'wrap', justifyContent: 'right' }}>
            <div className="space-between" style={{ flexWrap: 'wrap', width: 'max-content' }}>
                {
                    arbitrade?.dexes?.[0]?.output &&
                    <div className="summary-container space-between" style={{ flexWrap: 'wrap', }}>
                        <span className="trade-amount space-between" style={{ gap: 4 }}>
                            <div className="token-icon-wrap">
                                <img src={arbitrade?.dexes?.[0]?.paths?.[0]?.logoURI} className="token-icon" />
                            </div>
                            {arbitrade?.dexes?.[0]?.paths?.[0]?.symbol}&nbsp;
                            {precise(arbitrade?.amountIn)}
                        </span>
                        <CurrencyExchange style={{ fontSize: 16 }} />
                        <span className="trade-amount space-between" style={{ gap: 4 }}>

                            <div className="token-icon-wrap">
                                <img src={
                                    arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths?.[arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.paths?.length - 1]?.logoURI
                                } className="token-icon" />
                            </div>
                            {
                                arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]
                                    ?.paths?.[arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]
                                        ?.paths?.length - 1]?.symbol
                            }
                            &nbsp;
                            {
                                arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.output ?
                                    precise(sub(
                                        arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.output,
                                        arbitrade?.dexes?.[arbitrade?.dexes?.length - 1]?.output * 0.03 / 100)
                                        , 5).concat('+') : <CircularProgress size={13} color="warning" />
                            }
                        </span>
                    </div>
                }
                {/* {
                        isWritePrepareError && <div className="error-message  " style={{ flexGrow: 1 }}>
                            TNX May Fail
                            <div className="message">
                                {writePrepareError?.message}
                            </div>
                        </div>
                    } */}

                <Button
                    style={{ margin: 0, flexGrow: 1, fontSize: 12, fontWeight: 400 }}
                    disabled={waitTransaction?.isLoading || isApproving || sendSwap?.isLoading}
                    onClick={handleSendTransaction}
                    className='primary-button summary-container' >
                    {ButtonText} {waitTransaction?.isLoading || isApproving || sendSwap?.isLoading && <CircularProgress size={13} color="success" />}
                </Button>
            </div>
        </motion.div>
    )

    const autoSigningPanel = (
        <>Auto Mode</>
    )

    return (
        <div className="dash arb-summary " style={{ maxHeight: '100%', width: '100%', borderRadius: 0 }}>
            <Box className="dash-lin-box  transparent padding-none" style={{ boxShadow: 'none', margin: 0 }}>
                <div className="space-between">
                    <Button
                        onClick={() => props?.onShowDexes?.(o => !o)}
                        style={{ margin: 0, flexGrow: 1, fontSize: 12, fontWeight: 400 }}
                        disabled={arbitrade?.dexes?.length as any >= 4}
                        className={`primary-button summary-container`}>
                        {arbitrade?.dexes?.length as any >= 4 ? 'Limited For Account' : 'Select  Dexchange'}
                        {/* <Add /> */}
                    </Button>
                </div>
            </Box>

            {!isConnected ? <Web3Button /> : arbitrade?.settings?.auto ? autoSigningPanel : manualSigningPanel}

        </div>
    )
}
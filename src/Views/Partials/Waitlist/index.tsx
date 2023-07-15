import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import { IParams, Params } from "../../../Defaulds";
import { motion } from "framer-motion";
import { ArrowDownward, ArrowForward, ArrowForwardIos, ArrowUpward, Close, Maximize, ReadMore, TrendingUp, TroubleshootSharp } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Input, Typography } from "@mui/material";
import { useAccount, useBalance, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite, useProvider, useWaitForTransaction } from "wagmi";
import { cut, fmWei, precise, toWei } from "../../../Helpers";
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import relativeTime from 'dayjs/plugin/relativeTime'
import { COMBO_ABIs } from "../../../Ethereum/ABIs/index.ts";
import { useADDR } from "../../../Ethereum/Addresses";
import { Web3NetworkSwitch } from '@web3modal/react'

dayjs.extend(relativeTime)

export default function WaitListModal() {
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const [clipBoardContent, copyToClipboard] = useCopyToClipboard()
    const { address, isConnected } = useAccount()
    const { chain, } = useNetwork()
    const provider = useProvider()
    const ADDR = useADDR(chain?.id);
    const { data: reserveed } = useBalance({
        address: ADDR['COMBO_HELPER'],
        token: ADDR['COMBO_TOKEN'],
        watch: true
    })

    const setparams = (key: IParams['waitlist']['keys'], val: any) => {
        storeParams(p => ({ ...p, waitlist: { ...p.waitlist, [key]: val } }))
    }

    const AInfo = useContractReads({
        contracts: [
            { abi: COMBO_ABIs as any, functionName: '_maxDownlines', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_uplinecommision', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_amountClaimable', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_freebieEndDate', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_freebieStartDate', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_mintkns', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_maxtkns', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_icoStartDate', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_icoEndDate', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_rate', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: 'leadboard', address: ADDR['COMBO_HELPER'], args: [address] },
            { abi: COMBO_ABIs as any, functionName: 'getLeaderboardSize', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: 'getMyPosition', address: ADDR['COMBO_HELPER'] },
            { abi: COMBO_ABIs as any, functionName: '_insurer', address: ADDR['COMBO_TOKEN'] },
        ],
        watch: true,
        enabled: params.waitlist.visible,
        cacheTime: 0
    })

    const [amountEth, setamountEth] = useState(0)
    const [Focused, setFocused] = useState(false)
    const [BuyAmount, setBuyAmount] = useState(0)
    const [EthBalance, setEthBalance] = useState(0)
    const [ShowingReferral, setShowingReferral] = useState(false)
    const [TreasuryBalance, setTreasuryBalance] = useState<number | string>(0)

    const claimPrepHook = usePrepareContractWrite({
        abi: COMBO_ABIs as any,
        address: ADDR['COMBO_HELPER'],
        functionName: 'claimCombodexAirdrop',
        args: [params?.user?.referee ?? ADDR['COMBO_HELPER']],
        enabled: params?.waitlist?.openTab === 'airdrop' && params.waitlist.visible
    })
    const claimHook = useContractWrite(claimPrepHook?.data)
    const waitClaimhook = useWaitForTransaction({
        hash: claimHook?.data?.hash,
        enabled: params.waitlist.visible && params?.waitlist?.openTab === 'airdrop'
    })

    //
    const buyPrepHook = usePrepareContractWrite({
        abi: COMBO_ABIs as any,
        address: ADDR['COMBO_HELPER'],
        functionName: 'buyComboFlex',
        overrides: {
            value: toWei(amountEth)
        },
        enabled: params?.waitlist?.openTab === 'ICO' && params.waitlist.visible
    })
    const buyHook = useContractWrite(buyPrepHook.data)
    const waitBuyhook = useWaitForTransaction({
        hash: buyHook?.data?.hash,
        enabled: params.waitlist.visible && params?.waitlist?.openTab === 'ICO'
    })
    //
    const handleCliamTokens = () => {
        if (claimPrepHook.error) {
            setShowingReferral(true)
            return toast.error(String((claimPrepHook?.error as any)?.reason))
        }
        claimHook?.write?.()
    }

    const handleBuyTokens = () => {
        if (buyPrepHook.error) {
            return toast.error(String((buyPrepHook?.error as any)?.reason))
        }
        buyHook?.write?.()
    }

    const handleBuyAmoutnChange = (amount: number) => {
        const _rate = (AInfo?.data?.[9] as any)
        const _amount = _rate * amount
        const toastId = "TT"
        if (_amount + 1 <= Number(fmWei(AInfo?.data?.[5] as any))) {
            toast.warning("Min you can buy is: ".concat(fmWei(AInfo?.data?.[5] as any)).concat(" COF"), { toastId })
        }
        if (_amount <= Number(fmWei(AInfo?.data?.[6] as any))) {
            setamountEth(Math.abs(Number(amount)))
            setBuyAmount(_amount)
        }
        else if (_amount + 1 >= Number(fmWei(AInfo?.data?.[6] as any)))
            toast.warning("Max you can buy is: ".concat(fmWei(AInfo?.data?.[6] as any)).concat(" COF"), { toastId })
    }

    useEffect(() => {
        const TOAST_ID = "SESSION"
        if (claimHook?.isLoading || waitBuyhook?.isLoading)
            toast.warning("Wait, ❤️ Loading...",)
        if (claimHook?.data?.hash || buyHook?.data?.hash)
            toast.promise((claimHook?.data?.wait ?? buyHook?.data?.wait) as any,
                { pending: 'Waiting...', error: "Something went wrong 😥", "success": "Success!!!" }, { toastId: TOAST_ID }
            )
        if (claimHook?.error || buyHook?.error) {
            toast.error(String((claimHook?.error ?? buyHook?.error as any)?.reason))
            claimHook?.reset?.()
            buyHook?.reset?.()
        }

        isConnected || setparams('visible', false)

        return () => {
            ; (async () => {
                if (address) {
                    const bal = await provider.getBalance(address as any)
                    setEthBalance(Number(bal))
                }
                if (AInfo?.data?.[13]) {
                    const bal = await provider.getBalance(AInfo?.data?.[13] as any)
                    setTreasuryBalance(precise(fmWei(Number(bal)), 2))
                }
            })();
            // claimReset?.()
        }
    }, [waitClaimhook?.isLoading, claimHook?.error, claimHook?.data, claimHook?.isLoading, waitBuyhook?.status, buyHook?.error, buyHook?.data])

    const refLink = (copy?: boolean) => {
        const ref = window.location.origin.concat(`?ref=${address}`)
        if (!copy) {
            (async () => {
                const copied = await copyToClipboard(ref)
                if (copied) return toast.success("Ref link copied to clipboard...", { toastId: "ELL" })
            })();
        }
        return ref
    }

    if (!params.waitlist.visible) return <></>

    const AirdropPanel = (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            className="panel-waitlist">
            <div className="wait-clock-container">
                <div className="clock-wait">
                    {
                        Date.now() < Number(AInfo?.data?.[4] as any * 1000) ? "Starts ".concat(dayjs(AInfo?.data?.[4] as any * 1000).fromNow()) :
                            Date.now() < Number(AInfo?.data?.[3] as any * 1000) ? "Ends ".concat(dayjs(AInfo?.data?.[3] as any * 1000).fromNow())
                                : "🎁 CHECK BACK SOON 🎁"
                    }
                </div>
            </div>
            <div className="stats-dash-row">
                <div className="stats-dash-flexed-box halve-flex" data-name='👨‍👩‍👧‍👧'>
                    <Typography className="balance-overview-text" component='h4'>
                        Downlines
                    </Typography>
                    <p> 0/{Number(AInfo?.data?.[0] as any ?? 0)} </p>
                </div>

                <div className="stats-dash-flexed-box halve-flex" data-name='🎁'>
                    <Typography className="balance-overview-text" component='h2'>
                        {precise(fmWei((AInfo?.data?.[10] as any)?.tokensClaimed), 1)} COF
                    </Typography>
                    <Typography component='p'>
                        <span className="orangered">
                            REWARDS
                        </span>
                    </Typography>
                </div>
                <div className="stats-dash-flexed-box halve-flex" data-name='🏦'>
                    <Typography className="balance-overview-text" component='h4'>
                        {precise(reserveed?.formatted, 1)} COF
                    </Typography>
                    <Typography component='p'>
                        <span className="green">RESERVE</span>
                    </Typography>
                </div>

                <div className="stats-dash-flexed-box halve-flex" data-name={"🥇"}>
                    <Typography className="balance-overview-text" component='h4'>
                        {Number(AInfo?.data?.[12] as any ?? 0)} of {Number(AInfo?.data?.[11] as any ?? 0)}
                    </Typography>
                    <Typography component='p'>
                        <span className="green">LEAD~BOARD</span>
                    </Typography>
                </div>

                <div className="stats-dash-flexed-box halve-flex" data-name={"⏲️"}>
                    <Typography className="balance-overview-text" component='h4'>
                        {dayjs((AInfo?.data?.[10] as any)?.claimTIme * 1000).fromNow()}
                    </Typography>
                    <Typography component='p'>
                        <span className="green">ENTRY TIME</span>
                    </Typography>
                </div>
            </div>
            <hr style={{ opacity: .2 }} />
            {
                !ShowingReferral || <motion.div
                    className="share-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Alert
                        severity="info">
                        <span style={{ fontSize: 12 }}>
                            You can earn even more money by telling your friends about Combodex! When they join, you both get rewarded! 🎉
                            It's like having your own secret club where everyone wins! 🤝
                        </span>
                    </Alert>
                    <div className="space-between" style={{ width: '100%' }}>
                        {/* <ShareSocial
                            url={() => refLink(true)}
                            socialTypes={['facebook', 'twitter', 'reddit', 'linkedin']}
                        /> */}
                        ❤️🎁🚀💫🪴🪴🪴
                        <Button
                            style={{ fontSize: 10 }}
                            onClick={() => refLink(false)} >
                            {cut(address, 'left')}  Copy Link
                        </Button>
                    </div>
                </motion.div>
            }
            <div className="space-between" >
                <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: 100 }}>
                    <Button
                        style={{ fontSize: 10 }}
                        disableElevation
                        disabled={waitClaimhook?.isLoading || claimHook?.isError}
                        onClick={handleCliamTokens}
                        variant="contained"
                    >
                        CLAIM &nbsp;&nbsp;<span style={{ color: 'orangered' }}> {fmWei(AInfo?.data?.[2] as any)} COF </span>
                        &nbsp;{!waitClaimhook?.isLoading || <CircularProgress size={15} color="info" />}
                    </Button>
                </motion.div>

                <Button
                    style={{ fontSize: 10 }}
                    disableElevation
                    onClick={() => setShowingReferral(s => !s)} className="box-navigation-btn"
                    color="warning" >
                    EARN ${200}{ShowingReferral ? <ArrowUpward /> : <ArrowDownward />}
                </Button>
            </div>

        </motion.div>
    )

    const ICOPanel = (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            className="panel-waitlist">
            <div className="wait-clock-container">
                <div className="clock-wait">
                    {
                        Date.now() < Number(AInfo?.data?.[8] as any * 1000) ? "Starts ".concat(dayjs(AInfo?.data?.[8] as any * 1000).fromNow()) :
                            Date.now() < Number(AInfo?.data?.[7] as any * 1000) ? "Ends ".concat(dayjs(AInfo?.data?.[7] as any * 1000).fromNow())
                                : "🚀 CHECK BACK SOON ❤️"
                    }
                </div>
            </div>
            <div className="stats-dash-row">
                <div className="stats-dash-flexed-box halve-flex" data-name='➖'>
                    <Typography className="balance-overview-text" component='h4'>
                        {fmWei(AInfo?.data?.[5] as any ?? 0)}
                    </Typography>
                    <span>MIN COF</span>
                </div>

                <div className="stats-dash-flexed-box halve-flex" data-name='↗️'>
                    <Typography className="balance-overview-text" component='h2'>
                        {fmWei(AInfo?.data?.[6] as any ?? 0)}
                    </Typography>
                    <Typography component='p'>
                        <span className="orangered">
                            MAX COF
                        </span>
                    </Typography>
                </div>
                <div className="stats-dash-flexed-box halve-flex" data-name='🏦'>
                    <Typography className="balance-overview-text" component='h4'>
                        {precise(reserveed?.formatted, 1)}
                    </Typography>
                    <Typography component='p'>
                        <span className="green">RESERVE</span>
                    </Typography>
                </div>

                <div className="stats-dash-flexed-box halve-flex" data-name='...'>
                    <Typography className="balance-overview-text" component='h4'>
                        {precise(fmWei((AInfo?.data?.[10] as any)?.tokensBought ?? 0), 2)}
                    </Typography>
                    <Typography component='p'>
                        <span className="green">COF BOUGHT</span>
                    </Typography>
                </div>
                <div className="stats-dash-flexed-box halve-flex" data-name={chain?.nativeCurrency?.symbol ?? ";;;"}>
                    <Typography className="balance-overview-text" component='h4'>
                        {chain?.nativeCurrency?.symbol} {precise(fmWei((AInfo?.data?.[10] as any)?.ethContribution ?? 0), 2)}
                    </Typography>
                    <Typography component='p'>
                        <span className="green">CONTRIBUTION</span>
                    </Typography>
                </div>
            </div>
            <br />
            <label className="small-text">
                &nbsp;Enter Amount In ({precise(fmWei(String(EthBalance ?? 0)))}) {chain?.nativeCurrency?.symbol}
            </label>
            <Box className="alone-contianer " style={{ padding: '.4rem', marginTop: '.5rem' }}>
                <div className="space-between">
                    <div className="space-between" style={{ gap: 0, paddingInline: '.6rem' }}>
                        {<label className="input-label">{cut(chain?.nativeCurrency?.symbol, 'right')}</label>}&nbsp;
                        <Input
                            disableUnderline
                            type="number"
                            value={amountEth}
                            maxRows={1}
                            onFocus={() => setFocused(a => true)}
                            // error={String(selectedTrade.tradeAmount).length > 15 ? true : false}
                            className="input-reading transparent-input"
                            onChange={({ target: { value } }) => handleBuyAmoutnChange(Math.abs(Number(value)))}
                            placeholder={`0.00 ${chain?.nativeCurrency?.symbol ?? 'Connect Your Wallet'}`}
                        />
                    </div>
                    {/*  */}
                </div>
            </Box>
            <div className="space-between" style={{ flexWrap: 'wrap' }}>
                <div className="space-between" >
                    <Button
                        disableElevation
                        style={{ fontSize: 10 }}
                        // className="primary-button"
                        variant="contained"
                        onClick={() => handleBuyAmoutnChange(Number(fmWei(AInfo?.data?.[5] as any) ?? 0) / 100 * .1)}  >
                        {`min ~ ${chain?.nativeCurrency?.symbol ?? ''}   ${precise(Number(fmWei(AInfo?.data?.[5] as any) ?? 0) / 100 * .1, 4)}`}
                    </Button>
                    <ArrowForwardIos style={{ fontSize: 12 }} />
                    <Button
                        disableElevation
                        style={{ fontSize: 10 }}
                        // className="primary-button"
                        variant="contained"
                        onClick={() => handleBuyAmoutnChange(Number(fmWei(AInfo?.data?.[6] as any) ?? 0) / 100 * .1)} >
                        {`max ~ ${chain?.nativeCurrency?.symbol ?? ''} ${precise(Number(fmWei(AInfo?.data?.[6] as any) ?? 0) / 100 * .1, 4)}`}
                    </Button>
                </div>
                <Button
                    disableElevation
                    style={{ fontSize: 10 }}
                    className="bg-red"
                    disabled={waitBuyhook?.isLoading || buyHook?.isLoading || BuyAmount <= 0}
                    variant="contained"
                    onClick={handleBuyTokens} >
                    Buy {BuyAmount} COF &nbsp;{!waitBuyhook?.isLoading || <CircularProgress size={15} color="info" />}
                </Button>

            </div>
        </motion.div >
    )

    const ProgressPanel = (
        <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            className="panel-waitlist">
            <div className="wait-clock-container">
                <div className="clock-wait">
                    🪴🚀 THE TREASURY 💫
                </div>
            </div>
            <div className="stats-dash-row">
                <div className="stats-dash-flexed-box halve-flex" data-name='🪙'>
                    <Typography className="balance-overview-text" component='h4'>
                        TREASURY
                    </Typography>
                    <span>{`${chain?.nativeCurrency?.symbol ?? ""} ${TreasuryBalance}`}</span>
                </div>
                <div className="stats-dash-flexed-box halve-flex" data-name='💹'>
                    <Typography className="balance-overview-text" component='h4'>
                        INSURANCE
                    </Typography>
                    <span>{`${chain?.nativeCurrency?.symbol ?? ""} ${TreasuryBalance as any / 3}`}</span>
                </div>
            </div>
        </motion.div>
    )

    return (
        <div
            className="dialog-main"   >
            <motion.div
                className="dialog-content"
                animate={{ y: 0 }}
                initial={{ y: -100 }}
            >
                <div className="space-between">
                    <h3 className="h3-headline">PARTIBOARD <Button>  {cut(address)}</Button></h3>
                    <div className="space-between">

                        <Button onClick={() => setparams('visible', !params?.waitlist?.visible)}>
                            <Close />
                        </Button>
                    </div>
                </div>

                <Alert
                    severity="success">
                    <span style={{ fontSize: 12 }}>
                        Joining Combodex early ensures mutual benefits and maximizes opportunities for all participants in a collaborative and inclusive ecosystem.
                        By continuing you agree that you have read and understand <a href="" style={{ color: 'red' }}>
                            What is this? !!!!
                        </a>
                    </span>
                </Alert>
                <br />
                <Box className="box-navigation">
                    <div className="space-between" style={{ width: '100%', }}>
                        <div className="space-between">
                            <Button variant='contained' disabled={params.waitlist.openTab === 'airdrop'} onClick={() => setparams('openTab', "airdrop")} className="box-navigation-btn" >
                                Airdrop
                            </Button>
                            <Button disabled={params.waitlist.openTab === 'ICO'} onClick={() => setparams('openTab', "ICO")} className="box-navigation-btn" >
                                ICO
                            </Button>
                            {/* <Button disabled={params.waitlist.openTab === 'join'} onClick={() => setparams('openTab', "join")} className="box-navigation-btn"  >
                                Join
                            </Button> */}
                            <Button disabled={params.waitlist.openTab === 'progress'} onClick={() => setparams('openTab', "progress")} className="box-navigation-btn"  >
                                COMBO DAO
                            </Button>
                        </div>
                    </div>
                </Box>
                {params.waitlist.openTab === 'airdrop' && AirdropPanel}
                {params.waitlist.openTab === 'ICO' && ICOPanel}
                {params.waitlist.openTab === 'progress' && ProgressPanel}
            </motion.div>
        </div>
    )
}
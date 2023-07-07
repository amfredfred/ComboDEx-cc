import { Box, Button, Typography, Chip, Tooltip, Grid } from "@mui/material"
import Master from "../Layouts/Master"
import { useState, useEffect } from 'react'
import DoneIcon from '@mui/icons-material/DoneAllOutlined'
import GasMeterIcon from '@mui/icons-material/GasMeterOutlined'
import WalletIcon from '@mui/icons-material/WalletOutlined'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { useAccount, useNetwork, useContractWrite, useContractReads, useBalance, useProvider, useFeeData } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import { useADDR } from "../Ethereum/Addresses"
import { SHARED_WALLET as SABI } from "../Ethereum/ABIs/index.ts"
import { fmWei, precise, toWei } from '../Helpers'
import { toast } from 'react-toastify'
import useAssets from "../Assets"
import useWindowDimensions from "../Hooks/useWindowDimensions"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Timelapse } from "@mui/icons-material"
import { IContractRead } from "../Defaulds"
dayjs.extend(relativeTime)



export default () => {

    const [amount, setamount] = useState(0.5)
    const [tnxMode, settnxMode] = useState<'deposit' | 'withdraw'>('deposit')
    const { innerWidth } = useWindowDimensions()
    const provider = useProvider()
    const { isConnected, address, } = useAccount()
    const { chain } = useNetwork()
    const balance = useBalance({ address: address })
    const ADDR = useADDR(chain?.id)
    const assets = useAssets('images')

    const userData: IContractRead = { functionName: 'owner', abi: SABI, address: ADDR['SHARED_WALLET'] }
    const { data: feeData } = useFeeData({ watch: true, formatUnits: 'gwei' })
    const { data: userDatas, isLoading: u_loading } = useContractReads({
        contracts: [
            { ...(userData as any) },
            { ...(userData as any), functionName: 'ownershipPercentage', args: [address] },
            { ...(userData as any), functionName: 'conspectus', args: [address] },
            { ...(userData as any), functionName: 'contribute', args: [address] },
            { ...(userData as any), functionName: 'withdrawalFee', args: [] },
            { ...(userData as any), functionName: 'dilutedEarning', args: [address] },
            { ...(userData as any), functionName: 'minLockPeriod', },
            { ...(userData as any), functionName: 'lockMyFunds', args: [address] },
            { ...(userData as any), functionName: 'potentialEarn', args: [address] },
        ]
        , watch: true,
        cacheTime: 100
    })
    const [lockPeriod, setLockPeriod] = useState(Number(Number(((userDatas as any)?.[6]) / 3600).toFixed(2)))

    const { data, isLoading: tnx_loading, isSuccess, error, isError, write } = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: ADDR['SHARED_WALLET'] as any, abi: SABI, functionName: tnxMode,
        overrides: tnxMode === 'deposit' ? { value: toWei(amount) } : {},
        args: tnxMode === 'withdraw' ? [toWei(amount)] : [(lockPeriod * 3600).toFixed()] 
    })

    useEffect(() => {
        const toastId = "TNX_ID";
        (async () => await balance.refetch({ 'exact': true }))();

        if (isError) {
            if ('data' in (error as any))
                if ((error as any)?.data?.code == -32000)
                    toast.error("Insufficient Funds 🤚", { toastId })
        }
        if (isSuccess) {
            toast.success(`${tnxMode} successful`, { toastId })
        }
    }, [data, error, userDatas])

    useEffect(() => {

    }, [])


    async function handleDepOrWith() {
        if (tnxMode === 'deposit')
            if (lockPeriod < (userDatas as any)?.[6] / 3600)
                return toast.error(`Min lock periond is ${(userDatas as any)?.[6] / 3600}`)
        if (tnxMode === 'withdraw') {
            if (Number(String((userDatas as any)?.[8])) > 0) {
                const confirmed = window.confirm(`Hey, you may lose ${(userDatas as any)?.[8]}% if withdraw now\n\Our trading bots are currently in position with your fund, if you withdraw now, you will lose your share of the current position.. nope no loss for you`)
                if (!confirmed) return
            }
        }
        if (amount < 0.05)
            return toast.warn(`${chain?.nativeCurrency?.symbol} amount must be atleast 0.05`)
        write?.()
    }

    const NewTnxDeposit = (
        <Box className="input-area">
            <Box className="  alone-contianer">
                {
                    isConnected && <>
                        <Typography component={'p'} >
                            Your share in pool
                        </Typography>
                        <hr />
                    </>
                }
                {
                    isConnected ?
                        <Typography component={'p'} >
                            Your current ownership stake in the  pool capitalization is <span className="green">{u_loading ? 'loading' : precise((userDatas as any)?.[1] ?? 0)}%</span>
                        </Typography>
                        :
                        <Typography component={'p'} >
                            Wallet not <span className="orangered">Connected {isConnected && amount}</span>.
                        </Typography>
                }
            </Box>
        </Box>
    )

    const NewTnxWithdraw = (
        <Box className="input-area">
            <Box className="  alone-contianer">
                {
                    isConnected && <>
                        <Typography component={'p'} >
                            Withdraw up to <span className="orangered">{chain?.nativeCurrency?.symbol}{u_loading ? '---' : precise(fmWei((userDatas as any)?.[2]))}</span>
                        </Typography>
                        <hr />
                    </>
                }
                {
                    isConnected ?
                        <Typography component={'p'} >
                            Your current ownership stake in the  pool capitalization is <span className="green">%{u_loading ? '---' : precise((userDatas as any)?.[1] ?? 0)}</span>.
                        </Typography>
                        :
                        <Typography component={'p'}  >
                            Wallet not <span className="orangered">Connected {isConnected && amount}</span>.
                        </Typography>
                }
            </Box>
        </Box>
    )

    const NewTnxGrid = (
        <Box className="dash-lin-box">
            <Box className="box-navigation">
                <div className="space-between" style={{ width: '100%', }}>
                    <div className="space-between">
                        <Button onClick={() => settnxMode(s => 'deposit')} disabled={tnxMode === 'deposit'} className="box-navigation-btn" >
                            Deposit
                        </Button>
                        <Button onClick={() => settnxMode(s => 'withdraw')} disabled={tnxMode === 'withdraw'} className="box-navigation-btn"  >
                            Withdraw
                        </Button>
                    </div>
                    <CancelIcon className="primary-button" />
                </div>
            </Box>
            <Box className="box-input-area">
                <Box className="input-area">
                    <Box className="input-reactonly">
                        <Button className="primary-button" >
                            <label htmlFor="amount" className="input-label">{chain?.nativeCurrency?.symbol ?? '- - -'}</label>
                        </Button>
                        <input type="number" id="amount" className="input-reading"
                            onChange={(i: any) => setamount(o => (i.target.valueAsNumber >= 0) ? i.target.value : o)}
                            value={amount} placeholder={String(amount)} />
                    </Box>
                </Box>

                {tnxMode === 'deposit' ? NewTnxDeposit : NewTnxWithdraw}

                <Box className="input-area">
                    {
                        tnxMode === 'deposit' ?
                            <Box className="alone-contianer">
                                <div className="space-between">
                                    <Typography component={'p'} >
                                        Lockable Deposit
                                    </Typography>
                                    <InfoIcon />
                                </div>
                                <hr />
                                <div className="space-between">
                                    <input type="number" className="input-reading"
                                        onChange={(i: any) => setLockPeriod(o => (i.target.valueAsNumber >= 0) ? i.target.value : o)}
                                        value={lockPeriod} placeholder={precise((userDatas as any)?.[6] / 3600)} />
                                    <Button children='hours' />
                                </div>
                            </Box>
                            :
                            <Box className="alone-contianer">
                                <div className="space-between">
                                    <Typography component={'p'} >
                                        You Have Locked Deposit
                                    </Typography>
                                    <InfoIcon />
                                </div>
                                <hr />
                                <div className="space-between">
                                    <strong className="path-name" >
                                        {
                                            Number(String((userDatas as any)?.[8])) > 0 ? "YOUR POTENTIAL LOSS"
                                                : (userDatas as any)?.[7] * 1000 < Date.now() ? "Withdraw Funds"
                                                    : dayjs(Date.now()).to((userDatas as any)?.[7] * 1000)
                                        }
                                    </strong>
                                    <Timelapse />
                                </div>
                            </Box>
                    }
                </Box>

                <Box className="input-area" style={{ marginBottom: '1rem', borderRadius: 50, overflow: 'hidden' }}>
                    <div className="chip-wrapper">
                        <div className="tab-lets">
                            {tnxMode != 'deposit' ? <Chip
                                className="chip"
                                label={`Withdrawal fee %${precise((userDatas as any)?.[4] / 100 ?? 0)}`}
                                onClick={() => { }}
                                onDelete={() => { }}
                                deleteIcon={<WalletIcon color='success' />}
                            /> : <Chip
                                className="chip"
                                label={`Lockup Period ~ ${((userDatas as any)?.[6] / 3600).toFixed(2)} Hours`}
                                onClick={() => { }}
                                onDelete={() => { }}
                                deleteIcon={<DoneIcon />}
                            />}
                            <Chip
                                className="chip"
                                label={`Est. Gas Price ~ Gwei/${feeData?.formatted?.gasPrice}`}
                                onClick={() => { }}
                                onDelete={() => { }}
                                deleteIcon={<GasMeterIcon />}
                            />
                        </div>
                    </div>
                </Box>

                <Box className="input-area" >
                    {
                        isConnected ?
                            <Button
                                className={`primary-button ${tnxMode === 'withdraw' ? 'bg-red' : ''}`}
                                style={{ width: '100%', boxShadow: 'none' }} variant='contained'
                                disabled={tnx_loading || u_loading}
                                onClick={handleDepOrWith}>
                                {tnxMode}{(tnx_loading || u_loading) && "ing..."}
                            </Button>
                            : <div className="space-between">
                                <Web3Button label="Connect wallet first." />
                                <Button
                                    className={`  ${tnxMode === 'withdraw' ? 'bg-red' : ''}`}
                                    style={{ flexGrow: 1, borderRadius: 10, boxShadow: 'none', height:'100%' }} variant='contained'
                                    onClick={handleDepOrWith}>
                                    Learn More
                                </Button>
                            </div>
                    }
                </Box>
            </Box>

        </Box>
    )

    const UserStatsGrig = (
        <Box className="dash-main-box box-stats">
            <Typography component='h2' className="ident">
                Overview 🤚 {!isConnected && <span className="orangered">Connect your wallet</span>}
            </Typography>
            <Box className="box-input-area">
                <Box className="stats-sections">
                    <div className="space-between" style={{ width: 'max-content' }} >
                        <Typography className="balance-overview-text" component='h4'>
                            {chain?.nativeCurrency?.symbol} {u_loading ? '---' : precise(fmWei((userDatas as any)?.[2]))}
                        </Typography>
                        <Tooltip title={'includes: all the funds you can withdraw,  [capital, Profits]'}>
                            <InfoIcon />
                        </Tooltip>
                    </div>
                </Box>
                <Box className="stats-sections">
                    <div className="stats-dash-row">
                        <div className="stats-dash-flexed-box" data-name='+'>
                            <Typography className="balance-overview-text" component='h4'>
                                Credits
                            </Typography>
                            <Typography component='p'>
                                {chain?.nativeCurrency?.name}{u_loading ? '---' : precise(fmWei((userDatas as any)?.[3]))}
                            </Typography>
                        </div>

                        <div className="stats-dash-flexed-box" data-name='%/'>
                            <Typography className="balance-overview-text" component='h2'>
                                Pool Share
                            </Typography>
                            <Typography component='p'>
                                <span className="orangered">
                                    {u_loading ? '---' : precise((userDatas as any)?.[1] ?? 0)}%
                                </span>
                            </Typography>
                        </div>
                        <div className="stats-dash-flexed-box" data-name='-'>
                            <Typography className="balance-overview-text" component='h4'>
                                Diluted earnings
                            </Typography>
                            <Typography component='p'>
                                {chain?.nativeCurrency?.name} <span className="green">+{precise(fmWei((userDatas as any)?.[5] ?? 0))}</span>
                            </Typography>
                        </div>
                        {/* <div className="stats-dash-flexed-box" data-name='%'>
                            <Typography className="balance-overview-text" component='h4'>
                                Historical Profits
                            </Typography>
                            <Typography component='p'>
                                <span className="orangered">DATA COMING SOON</span>
                            </Typography>
                        </div> */}

                    </div>
                </Box>
            </Box>
        </Box>
    )


    return (
        <Master>
            {
                !isConnected && <Typography component='p' style={{ padding: '1rem', textAlign: 'center', width: '100%' }}>

                </Typography>
            }
            <Grid className="dash" style={{ borderRadius: 20 }}>
                {NewTnxGrid}
                {
                    innerWidth > 600 && <Box className="dash-main-box" >
                        <div className="img-code">
                            <img src={(assets as any)?.[tnxMode === 'deposit' ? 'deposit_code' : 'withdraw_code']} alt="" className="code-intereact" />
                        </div>
                        <div className="img-code">
                            <img src={(assets as any)?.sync_code} alt="" className="code-intereact" />
                        </div>
                    </Box>
                }
                {UserStatsGrig}
            </Grid>
        </Master>
    )
}
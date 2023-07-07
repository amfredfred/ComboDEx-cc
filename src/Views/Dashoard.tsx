import Master from "../Layouts/Master"
import { Grid, Box, Typography, Button, Divider, LinearProgress } from '@mui/material/'
import { useNetwork, useContractReads, useContractRead, useProvider } from 'wagmi'
import { fmWei, NumCompact, precise } from "../Helpers"
import { SHARED_WALLET as SABI, PRICE_ORACLE as PABI } from "../Ethereum/ABIs/index.ts"
import { useADDR } from "../Ethereum/Addresses"
import { useEffect, useState } from "react"
import { ArrowRight, InfoOutlined } from "@mui/icons-material"
import { Link } from 'react-router-dom'

interface IcontractRead {
    functionName: string,
    abi: typeof SABI,
    address: string
}

export default () => {

    const { chain } = useNetwork()
    const provider = useProvider()
    const [nBal, setNBal] = useState('0.00')
    const ADDR = useADDR(chain?.id)

    const useDate: IcontractRead = { functionName: 'getLastPair', abi: PABI, address: ADDR['PRICE_ORACLEA'] }
    const { data: lastPair } = useContractRead({ ...(useDate as any), watch: true, args: [ADDR?.DEXS[1]?.FACTORY] })

    const { data: ttkn } = useContractRead({
        ...(useDate as any), functionName: "getTokenFromPair", args: [lastPair], watch: true
    })

    const { data: hasLiquididty } = useContractRead({
        ...(useDate as any), functionName: "hasLiquidity", watch: true,
        args: [ADDR['PRICE_ORACLEA'], (ttkn as any)?.[0]]
    })

    const { data: tokenInfo } = useContractReads({
        contracts: [
            { abi: PABI, address: (ttkn as any)?.[0], functionName: "name" },
            { abi: PABI, address: (ttkn as any)?.[0], functionName: "decimals" },
            { abi: PABI, address: (ttkn as any)?.[0], functionName: "symbol" }
        ],
        watch: true
    })

    const trackingNewPair = useContractReads({
        contracts: [
            { ...(useDate as any), functionName: 'getTokenPairReserves', args: [lastPair] },
            { ...(useDate as any), functionName: 'getTokenFromPair', args: [lastPair] }
        ],
        watch: true,
    })

    const trackingTokenPrice = useContractReads({
        contracts: [
            { ...(useDate as any), functionName: 'getTokenPriceInWETH', args: [(ttkn as any)?.[0]] },
            { ...(useDate as any), functionName: 'getTokenPriceInUSDT', args: [(ttkn as any)?.[0]] }
        ],
        watch: true,
    })



    useEffect(() => {

        (async () => {
            const nativeBalance = await provider.getBalance(ADDR['SHARED_WALLET'])
            const formarted = precise(fmWei(nativeBalance as any))
            // console.log(await provider.getTransactionCount((ttkn as any)?.[0]))
            setNBal(o => o = formarted)
        })();

    }, [trackingTokenPrice])


    return (
        <Master>
            <Grid className="dash" style={{ borderRadius: 20 }}>
                <Box className="flexed-dash ">
                    <div className="dash-main-box box-stats">
                        <div className="space-between">
                            <h2 className="headline-2">
                                POOL VALUATION
                            </h2>
                            <InfoOutlined />
                        </div>

                        <Box className="stats-sections">
                            <Typography className="balance-overview-text" component='h4'>
                                {chain?.nativeCurrency?.symbol} {nBal}
                            </Typography>
                            <span className="usd-price" >
                                <s> $0,000,000.00</s>
                            </span>
                        </Box>
                        <Button
                            variant="contained"
                            className="primary-button bg-red"
                            style={{ width: '100%', marginTop: '1rem' }}
                            onClick={() => window.location.href = '../shared-wallet'}
                        >
                            Earn passive income
                        </Button>
                    </div>
                </Box>


                <Box className="flexed-dash ">
                    <div className="dash-main-box box-stats ">
                        <div className="space-between">
                            <h2 className="headline-2">
                                Tracking last pair
                            </h2>
                            <InfoOutlined />
                        </div>
                        <div className="snack-bar warning">
                            This is the newest created pair on Uniswap
                        </div>
                        <div className="only-two-flexed">
                            <div className="two-flexed-inner">
                                <h3 className="headline-3">
                                    {(tokenInfo as any)?.[2]}/WETH  {precise(fmWei((trackingTokenPrice?.data as any)?.[0]), 10)}
                                </h3>
                            </div>
                        </div>

                        {
                            hasLiquididty ? <>
                                <small className="text-small">&cong; ${precise(fmWei((trackingTokenPrice?.data as any)?.[1]), 10)}  </small>

                                <div className="space-between top-level-three">
                                    <span className="text">
                                        {(tokenInfo as any)?.[0]}
                                    </span>
                                    <span className="text">
                                        {(tokenInfo as any)?.[2]}
                                    </span>
                                    <span className="text">
                                        {fmWei((tokenInfo as any)?.[1], 0)}
                                    </span>
                                </div>

                                <div className="top-level-three all-center">
                                    <Typography component={'p'} >
                                        Pool Valuation
                                    </Typography>

                                    <div className="space-between">
                                        <span className="usd-price" >
                                            {chain?.nativeCurrency?.symbol} {NumCompact(precise(fmWei((trackingNewPair?.data as any)?.[0]?.[0]), 10))}
                                        </span>
                                        <span className="usd-price" >
                                            {(tokenInfo as any)?.[2]} {NumCompact(precise(fmWei((trackingNewPair?.data as any)?.[0]?.[1])))}
                                        </span>
                                    </div>
                                </div>
                            </>
                                : <div className="top-level-three all-center">
                                    No liquidity yet for {chain?.nativeCurrency?.symbol}/{(tokenInfo as any)?.[2] ?? "- - -"}
                                    <Divider />
                                    <Box sx={{ width: '100%', marginBlock: '.7rem', borderRadius: 50, overflow: 'hidden' }}>
                                        <LinearProgress />
                                    </Box>
                                    <span className="orangered"> watching... </span>
                                </div>
                        }

                        <div className="space-between">
                            <Link to={`../snipper?pair=${lastPair}&dex=uniswap`}>
                                <Button className=" primary-button">
                                    Early Access
                                </Button>
                            </Link>
                            <a href={`../explorer?page=pairs`}
                                className="space-between">
                                <Button className=" primary-button">
                                    New Pairs<ArrowRight />
                                </Button>
                            </a>
                            <a target="_balnk" href={`${chain?.blockExplorers?.default?.url}/address/${lastPair}`}
                                className="space-between">
                                <Button className=" primary-button">
                                    Explore<ArrowRight />
                                </Button>
                            </a>
                        </div>
                    </div>
                </Box>
                <Box className="flexed-dash box-stats">
                    <div className="dash-main-box ">
                        COMING SOON
                    </div>
                </Box>
            </Grid>
        </Master>
    )
}
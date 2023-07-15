import { Box, Button, CircularProgress, FormControlLabel, Grid, Switch } from "@mui/material";
import Master from "../Layouts/Master";
import { useAccount, useNetwork, useBalance, useSignMessage } from "wagmi";
import { useState, useEffect } from "react";
import DexChanges from "./Partials/DexChanges";
import useDecentralizedExchange from "../Hooks/useDecentralizedExchamge";
import { ArrowRight, Route, Settings } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";
import { IDex, IParams, ITokenInfo, Params } from "../Defaulds";
import ArbitradeRouteBuilder from "./Partials/Arbitrade/RouteBuilder";
import { TokensList } from "./Partials/Tokens";
import ArbitrageRoutePath from "./Partials/Arbitrade/RoutePath";
import Summary from "./Partials/Arbitrade/Summary";
import { precise } from "../Helpers";
import ArbitrageSettings from "./Partials/Arbitrade/ArbitrageSettings";
import { toast } from 'react-toastify'
import DiscoverArbitrageOpportunities from "./Partials/Arbitrade/DiscoverOpportunities";
import { motion } from 'framer-motion'

export default function Arbitrage() {
    const { chain } = useNetwork()
    const [showDexes, setShowDexes] = useState(false)
    const [showTokens, setShowTokens] = useState(false)
    const [isShowingSettings, setisShowingSettings] = useState(false)
    const [isDiscoverMode, setisDiscoverMode] = useState(false)
    const { dexs } = useDecentralizedExchange()
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const { arbitrade: { settings: arbSettings, dexes, amountIn } } = params
    const { address } = useAccount()
    const signerMessage = useSignMessage()

    const frombalance = useBalance({
        address,
        token: dexes?.[0]?.paths?.[0]?.address as any,
        enabled: Boolean(dexes?.[0]?.paths?.[0]?.address)
    })

    const setParams = (key: IParams['arbitrade']['keys'], val: any) =>
        storeParams(o => o = { ...o, arbitrade: { ...o.arbitrade, [key]: val } })
        

    const handleNewDexSelected = (dexname: string) => {
        setShowDexes(false)
        const selected = (dexes || []) as any
        const dex = dexs?.filter((d: any) => d?.NAME === dexname)[0] //IDex
        if (selected.length >= 3) {
            const paths = selected[selected?.length - 1]?.paths || []
            selected[selected.length - 1] = dex
            selected[selected.length - 1]['paths'] = paths
        }
        else selected[selected.length as any] = dex

        setParams('dexes', selected)
    }

    const handleRemoveDex = async (dexId: any) => {
        const dex = dexes?.filter((dexIt, index: any) => {
            const deletedPath = dexes?.[dexId]?.paths
            if (index === dexId) return
            if (dexId + 1 === index) dexIt['paths'] = deletedPath
            return dexIt
        })
        setParams('dexes', dex)
    }

    const appendTokenForPath = (token: ITokenInfo, dexId: number, isChecked: boolean) => {
        const modifiedDex = dexes?.map((dex: IDex, index: number) => {
            let paths = dex['paths'] || []
            if ((index === dexId)) {
                paths = paths?.filter((tInPath: ITokenInfo) => tInPath?.symbol !== token?.symbol) as [ITokenInfo];
                isChecked || paths?.push(token)
                if (paths?.length <= 5)
                    dex['paths'] = paths
            }
            if (index > 0 && Boolean(dexes?.[index - 1]?.paths?.length)) {
                const firtSibling0 = dexes?.[index - 1]?.paths?.[dexes?.[index - 1]?.paths?.length - 1]
                const pathLine = paths?.filter((tInPath: ITokenInfo) => firtSibling0?.symbol !== tInPath?.symbol);
                pathLine.unshift(firtSibling0);
                dex['paths'] = pathLine as [ITokenInfo]
            }
            return dex
        })
        setParams('dexes', modifiedDex)
    }

    useEffect(() => {
        if (signerMessage?.data) {
            if (signerMessage?.isSuccess)
                arbSettings?.auto || setParams('settings', { ...arbSettings, auto: true })
        }


        return () => {
            signerMessage?.reset()
        }
    }, [signerMessage?.data, signerMessage?.isSuccess])


    const handleUseAuto = () => {
        if (arbSettings?.auto) return setParams('settings', { ...arbSettings, auto: false })

        signerMessage.signMessage({
            message: "By signing this message, You are athourizing Yieldtrinity to use your wallet to make trades on your behalf...",
        })
    }


    const ArbitrageTradeExecutive = (
        <motion.div
            initial={{ marginLeft: -100 }}
            animate={{ marginLeft: 0 }}
            className="dash relative">
            <Box className="dash-lin-box sticky-top transparent padding-none" style={{ boxShadow: 'none', borderRadius: 0 }}>
                {
                    dexes?.map((a: any, index: any) => {
                        return <ArbitradeRouteBuilder
                            key={"ROUTE_BUILDER-" + Math.random()}
                            setParams={(key: any, val: any) => setParams(key, val)}
                            amount={100}
                            dex={a}
                            dexId={index}
                            onShowDexes={setShowDexes}
                            onRemove={handleRemoveDex}
                            onShowTokens={setShowTokens}
                        />
                    })
                }
            </Box>
            {/* TRADE ROUTES */}
            <Box className="dash-main-box box-stats sticky-top" style={{ background: 'transparent', padding: 0 }}>
                {/* <div className="space-between">
                        <h3 className="headline-3 space-between" style={{ gap: '.3rem' }}>
                            <Route />Routes 🤚
                        </h3>
                        <span></span>
                    </div> */}
                <div className="trade-routes">
                    {
                        dexes?.map((dex, index: number) => {
                            if (dex?.paths?.length > 1)
                                return <ArbitrageRoutePath key={index} dexId={index} dex={dex} />
                            return <span key={Math.random()}></span>
                        })
                    }
                </div>
            </Box>
            {/* TRADE SUMMARY AND SEND TRANSACTION */}
            <Summary onShowDexes={setShowDexes} />
        </motion.div>
    )

    return (
        <Master>
            <Grid className="dash relative" style={{ maxHeight: '100%' }}>
                <Box className='space-between' style={{ width: '100%' }}>
                    <Box className="dash-lin-box  transparent padding-none" style={{ boxShadow: 'none', borderRadius: 0 }}>
                        {/* ROUTE BUILDER FOR PATH */}
                        <div className="space-between" style={{ width: '100%', }}>
                            <div className="space-between">
                                <FormControlLabel
                                    control={<Switch
                                        onChange={handleUseAuto}
                                        checked={arbSettings?.auto} />}
                                    label="Auto"
                                />
                                <CircularProgress
                                    color="inherit"
                                    size={10}
                                />
                            </div>
                            <Settings
                                className="primary-button"
                                onClick={() => setisShowingSettings(s => !s)}
                            />
                        </div>
                        <br />
                        <div className="space-between">
                            <input className="input-reading styled-input"
                                type="number"
                                onChange={({ target: { value } }) => setParams('amountIn', Math.abs(Number(value)))}
                                onFocus={() => { }}
                                value={amountIn}
                                step={0.055}
                                placeholder='Amount to spend' />
                        </div>
                        <small className="space-between" style={{ minWidth: 'max-content', padding: '.5rem', fontSize: 10, opacity: .6 }}>
                            Balance {dexes?.[0]?.paths?.[0]?.symbol}&nbsp;{precise(frombalance?.data?.formatted ?? 0, 10)}
                        </small>
                    </Box>

                    <Box className="dash-main-box box-stats transparent sticky-top">
                        <div className="space-between">
                            <span> </span>
                            <Button
                                onClick={() => setisDiscoverMode(al => !al)}
                            >
                                {isDiscoverMode ? "Arbitrade" : "Discover"} <ArrowRight />
                            </Button>
                        </div>
                    </Box>
                </Box>


                {isDiscoverMode ? <DiscoverArbitrageOpportunities /> : ArbitrageTradeExecutive}


            </Grid>
            {/* MODALS */}
            <DexChanges
                selected={null}
                shown={showDexes}
                onSelect={handleNewDexSelected}
                toggle={setShowDexes}
            />
            <ArbitrageSettings
                shown={isShowingSettings}
                toggle={setisShowingSettings}
                setparams={setParams}
            />

            <TokensList
                shown={showTokens}
                toggle={setShowTokens}
                selected={'NODE'}
                onSelect={appendTokenForPath}
            />
        </Master>
    )
}
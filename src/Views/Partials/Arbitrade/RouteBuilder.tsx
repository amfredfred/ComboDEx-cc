import { ArrowForward, Close } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { motion } from 'framer-motion'
import { useLocalStorage } from "usehooks-ts";
import { Params, IParams, IArbitradeRouteBuilder } from "../../../Defaulds";



export default function ArbitradeRouteBuilder(props: IArbitradeRouteBuilder) {

    const { dex, amount, onRemove, onShowDexes, dexId,  onShowTokens, setParams } = props
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)


    return (
        <motion.div
            // animate={{ y: 0, opacity: 1 }}
            // initial={{ y: -20, opacity: .3 }}
            // exit={{ y: 30, opacity: 0 }}
            className="box-input-area bg-box arbitrage-route">
            <Box className="input-area">
                <Box className="space-between isolated-container" style={{ zIndex: 20 }}>
                    <Button
                        onClick={() => {
                            setParams('currentDexId', dexId)
                            onShowDexes(s => !s)
                        }}
                        variant='contained'
                        style={{ padding: '.2rem' }}
                        className={`primary-button dark-button ${!dex?.NAME && 'error'}`}>
                        <img src={dex?.ICON} alt={dex?.SYMBOL} className="icon" />&nbsp;{dex?.NAME ?? `Invalid DEX`}
                    </Button>
                    <Close className="close-button" onClick={() => onRemove(dexId)} />
                </Box>
                <br />
                <Button
                    variant="contained"
                    onClick={() => {
                        setParams('currentDexId', dexId)
                        onShowTokens(s => !s)
                    }}
                    className=" primary-button dark-button padding-none arb-button-selector">
                    {params?.arbitrade?.dexes?.[dexId]?.paths?.length ? 'PATH' : 'SELECT TRADE PATH'}&nbsp;

                    <div className="tokens-path-is">{
                        params?.arbitrade?.dexes?.map((dex: any, index: number) => {
                            if (index === dexId)
                                return dex?.paths?.map((path: any) =>
                                    <div className="token-icon-wrap" key={"ROUTE_PATH-" + Math.random()}>
                                        <img src={path?.logoURI} alt={path?.symbol} className="token-icon" />
                                    </div>
                                )
                            return <span key={"ROUTE_PATH-"+ Math.random() } ></span>
                        })
                    }</div>
                    <ArrowForward />
                </Button>
            </Box>
        </motion.div>
    )
}
import { useLocalStorage } from "usehooks-ts";
import { IParams, Params } from "../../../Defaulds";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { Alert, Box, Button } from "@mui/material";

export default function WaitListModal() {
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)

    if (!params.waitlist.visible) return <></>

    const setparams = (key: IParams['waitlist']['keys'], val: any) => {
        storeParams(p => ({ ...p, waitlist: { ...p.waitlist, [key]: val } }))
    }


    const AirdropPanel = (
        <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="panel-waitlist">
            dd
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
                    <h3 className="h3-headline">PARTIBOARD</h3>
                    <Button onClick={() => setparams('visible', !params?.waitlist?.visible)}>
                        <Close />
                    </Button>
                </div>

                <Alert
                    severity="success">
                    <span style={{fontSize:12}}>
                        Joining Combodex early ensures mutual benefits and maximizes opportunities for all participants in a collaborative and inclusive ecosystem.
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
                                Progress
                            </Button>
                        </div>
                    </div>
                </Box>
                {params.waitlist.openTab === 'airdrop' && AirdropPanel}
            </motion.div>
        </div>
    )
}
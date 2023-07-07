import { useLocalStorage } from "usehooks-ts";
import { IParams, Params } from "../../../Defaulds";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function WaitListModal() {
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)

    if (!params.waitlist.visible) return <></>

    return (
        <div
            className="dialog-main"   >
            <motion.div
                className="dialog-content"
                animate={{ y: 0 }}
                initial={{ y: -100 }}
            >
                <div className="space-between">
                    <h3 className="h3-headline">JOIN WAITLIST</h3>
                    <Button onClick={() => storeParams(p => ({ ...p, waitlist: { ...p.waitlist, visible: false } }))}>
                        <Close />
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
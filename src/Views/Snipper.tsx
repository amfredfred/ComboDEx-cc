import Master from "../Layouts/Master";
import ManualSnipper from "./Partials/Snipper/ManualSnipper";
import { useState } from 'react'
import { useLocalStorage } from "usehooks-ts";
import { Params, IParams } from "../Defaulds";
import SnipperSettings from "./Partials/Snipper/SnipperSettings";
import DexChanges from "./Partials/DexChanges";

export default function Snipper() {
    const [showSnipperSettings, setShowSnipperSettings] = useState<boolean>(false)
    const [showDexes, setShowDexes] = useState(false)
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)

    const setsnipperconfigs = (key: IParams['snipper']['keys'], val: any) =>
        storeParams(o => o = { ...o, snipper: { ...o.snipper, [key]: val } })

    const handleNewDexSelected = (dex: string) => {
        setShowDexes(false)
        setsnipperconfigs('dex', dex)
    }

    return <Master>
        <ManualSnipper
            settings={setShowSnipperSettings}
            setparams={setsnipperconfigs}
            dexes={setShowDexes}
        />

        {/* MODALS */}
        <SnipperSettings
            shown={showSnipperSettings}
            toggle={setShowSnipperSettings}
            setparams={setsnipperconfigs}
            selected={null}
            onSelect={() => Boolean}
        />

        <DexChanges
            shown={showDexes}
            selected={params?.snipper?.dex}
            onSelect={handleNewDexSelected}
            toggle={setShowDexes}
        />

    </Master>
}
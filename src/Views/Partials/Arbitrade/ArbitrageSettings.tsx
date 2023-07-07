import { CancelPresentation } from "@mui/icons-material";
import ContentModal from "../../../Components/Modal";
import { IArbitrade, IArbitradeSettings, IParams, ISnipperSettings, Params } from '../../../Defaulds'
import { Button, Checkbox, FormControlLabel, Input, Switch } from "@mui/material";
import { useLocalStorage } from "usehooks-ts";
import { notify } from "../../../Helpers";

export default function ArbitrageSettings(props: IArbitradeSettings) {
    const { shown, toggle, setparams } = props
    const [params, setParams] = useLocalStorage<IParams>('@Params', Params)


    return (
        <ContentModal onModalClose={() => toggle(s => false)} shown={shown} position="left">
            <div className="modal-heading">
                <div className="space-between">
                    <h3 className="modal-headline">Configurations</h3> <CancelPresentation onClick={() => toggle(s => !s)} />
                </div>
                <p className="small-text white" style={{ padding: 0, margin: 0 }}>update the configurations to suit you,how you get notification, etc</p>
            </div>
            <div className="settings-containner">
                <p className=" white">
                    Auto Trader
                    <p className="small-text white" style={{ padding: 0, margin: 0 }}>
                        bot recommended (<a href=""> download </a>)
                    </p>
                </p>
                <div className="space-between">
                   
                </div>
                <p className="paragraph small-text">
                    Mode
                </p>
                <div className="space-between">
                    <FormControlLabel control={<Checkbox
                        checked={params?.snipper?.mode === 'small'} />}
                        label="Small"
                    />
                    <FormControlLabel control={<Checkbox
                        checked={params?.snipper?.mode === 'mini'} />}
                        label="Mini"
                    />
                    <FormControlLabel control={<Checkbox
                        disabled
                        checked={params?.snipper.mode === 'full'} />}
                        label="Full"
                    />
                </div>
            </div>
            <Button
                onClick={() => setParams(state => state = Params)}
                className="reset-button-bottom">
                Reset to default
            </Button>
        </ContentModal >
    )
}
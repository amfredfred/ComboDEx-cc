import { CancelPresentation } from "@mui/icons-material";
import ContentModal from "../../Components/Modal";
import { useADDR } from "../../Ethereum/Addresses";
import { Button, Checkbox } from "@mui/material";
import { useLocalStorage } from "usehooks-ts";
import { IParams, ISnipperParams, ITokenInfo, Params } from "../../Defaulds";

export interface ITokensList {
    shown: boolean,
    selected: any,
    toggle: ISnipperParams['settings'],
    onSelect(token: ITokenInfo, passed: any, isChecked: boolean): void
    pathId?: 'from' | 'to'
}

export function TokensList(props: ITokensList) {
    const { shown, onSelect, toggle, selected, pathId } = props
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const selections = params?.arbitrade?.dexes?.[params?.arbitrade?.currentDexId as any]?.paths

    const ADDR = useADDR();
    const tokensList = (
        <div className="flexed-tabs">
            {
                (ADDR?.TOKENS as any)?.map((token: ITokenInfo, index: any) => {
                    const isInPath = selections?.filter((tInPath: ITokenInfo) => token?.symbol === tInPath?.symbol)
                    const isChecked = Boolean(isInPath?.length)
                    return <Button
                        key={index + '-' + token.name}
                        onClick={() => onSelect(token, params?.arbitrade?.currentDexId, isChecked)}
                        disabled={(selections?.length as number >= 5) && (!isChecked)}
                        style={{ padding: '.2rem', width: '100%', opacity: (token?.name?.includes(selected)) ? 0.2 : 1, color: 'white' }}
                        className={`flexed-tab capitalize ${!token?.name && 'error'}`}>
                        <div className="space-between" style={{ width: '100%' }}>
                            <div className="space-between" >
                                <img src={token?.logoURI} alt={token?.symbol} className="icon" />
                                <div className="flex-col" style={{ paddingLeft: '.5rem' }}>
                                    <span>{token?.symbol}</span>
                                    <span className="small-text">{token?.name}</span>
                                </div>
                            </div>
                            <Checkbox checked={isChecked} />
                        </div>
                    </Button>
                })
            }
        </div>
    )

    return <ContentModal
        position='center'
        shown={shown}
        onModalClose={() => toggle(s => false)}>
        <div className="modal-heading">
            <div className="space-between">
                <h3 className="modal-headline">Select Token</h3> <CancelPresentation onClick={() => toggle(s => false)} />
            </div>
            <p className="small-text white" style={{ padding: 0, margin: 0 }}>
                Select Path For
                {params?.arbitrade?.currentDexId}
            </p>
        </div>
        {tokensList}
    </ContentModal>
}
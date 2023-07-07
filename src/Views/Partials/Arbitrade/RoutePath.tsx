import { useContractRead, useNetwork } from "wagmi"
import { IContractRead, IDex, IParams, Params } from "../../../Defaulds"
import { useADDR } from "../../../Ethereum/Addresses"
import { PRICE_ORACLE } from "../../../Ethereum/ABIs/index.ts"
import { fmWei, precise, toWei } from "../../../Helpers"
import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"
import { CircularProgress } from "@mui/material"

export const RoutePathOutput = () => {

}

export default function ArbitrageRoutePath(props: { dex: IDex, dexId: number }) {

    const { dex, dexId } = props
    const { chain } = useNetwork()
    const ADDR = useADDR(chain?.id)
    const [{ arbitrade }, storeParams] = useLocalStorage<IParams>('@Params', Params)

    const setParams = (key: IParams['arbitrade']['keys'], val: any) => storeParams(o => o = {
        ...o, arbitrade: { ...o.arbitrade, [key]: val }
    })

    const handleOutputUpdateForDex = async (dexId: any, output: any) => {
        const modified = arbitrade?.dexes?.map((dex, index) => {
            if (index === dexId) dex['output'] = output;
            return dex
        })
        setParams('dexes', modified)
    }

    const target: IContractRead = {
        functionName: "_getRouteOutput",
        abi: PRICE_ORACLE,
        address: ADDR['PRICE_ORACLEA'] as any,
        args: [
            dex?.router,
            [],
            toWei(
                dexId === 0 ? arbitrade?.amountIn : (arbitrade?.dexes?.[dexId - 1]?.output || 0),
                dexId === 0 ? arbitrade?.dexes?.[0]?.paths?.[0]?.decimals :
                    arbitrade?.dexes?.[dexId - 1]?.paths?.[arbitrade?.dexes?.[dexId - 1]?.paths?.length - 1]?.decimals
            )],
    }

    dex?.paths?.map((token) => (target['args'][1]).push(token?.address))

    const { data, error, isLoading, refetch, status, isError } = useContractRead({
        ...target,
        watch: true,
        cacheTime: 0,
        staleTime: 0,
        enabled: Boolean(arbitrade?.amountIn > 0 && target['args'][1]?.length > 1)
    })


    useEffect(() => {
        if (!data || isError) {
            handleOutputUpdateForDex(dexId, fmWei(0))
            !isLoading || refetch()
        }
        else
            handleOutputUpdateForDex(dexId, fmWei(data as any ?? 0, arbitrade?.dexes?.[dexId - 1]?.paths?.[arbitrade?.dexes?.[dexId - 1]?.paths?.length - 1]?.decimals))
    }, [data, error, status, isError])


    return <div className="trade-path" key={Math.random()}>
        <div className="dex-name">{dex?.NAME}</div>
        <div className="trade-paths space-between">
            {
                dex?.paths?.map((path: any, index: number) => {
                    return (
                        <div key={"PATH-DEX-" + Math.random()} className="trade-path-ind">
                            <div className="space-between">
                                <div className="space-between" style={{ width: 'max-content', gap: '.3rem' }}>
                                    <div className="token-icon-wrap">
                                        <img src={path?.logoURI} alt={path?.symbol} className="token-icon" />
                                    </div>
                                    <span className="token-info">{path?.symbol}</span>
                                </div>

                                <span className="trade-amount">
                                    {isLoading ? <CircularProgress size={16} color="warning" />
                                        : (index == 0) &&
                                        precise(
                                            (dexId === 0) ? arbitrade?.amountIn
                                                : arbitrade?.dexes?.[dexId - 1]?.output, 4
                                        )
                                    }
                                    {isLoading ? '' : (index == dex?.paths?.length - 1) && precise(dex?.output, 4)}
                                </span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>

}
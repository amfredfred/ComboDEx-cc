import { Button, CircularProgress } from "@mui/material";
import { IOpportunityCard, IParams, Params } from "../../../../Defaulds";
import { useLocalStorage } from "usehooks-ts";
import { Add, SwapHorizRounded, ArrowRightAlt, ArrowForward } from "@mui/icons-material";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { precise, NumCompact, fmWei, toWei } from "../../../../Helpers";
import Images from '../../../../Assets/image/quickswap-icon.jpg'
import { useADDR } from "../../../../Ethereum/Addresses";




export default function OpportunityCard(props: IOpportunityCard) {

    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const { address } = useAccount()
    const { chain, } = useNetwork()
    const ADDR = useADDR(chain?.id);

    const inputBalance = useBalance({
        address,
        token: props?.pathFiltered?.[0] as any,
        enabled: Boolean(address && props?.pathFiltered?.[0]),
        watch: true,
        cacheTime: 0
    })

    const outPut = useContractRead({
        address: ADDR['PRICE_ORACLEA'],
        functionName: "_getRouteOutput",
        args: [
            props?.dex?.router,
            props?.pathFiltered,
            toWei(params?.arbitrade?.amountIn, props?.paths?.[0]?.decimals)
        ],
        abi: ["function _getRouteOutput( address route,  address[] calldata path,   uint256 amountIn ) public view returns(uint256)"],
        watch: true,
        cacheTime: 0,
        enabled: Boolean(Number(params?.arbitrade?.amountIn) > 0 && props?.pathFiltered?.length > 1 && props?.dex?.router)
    })

    const dataNum = Number(precise(Math.random() * 1.6, 1))

    return (
        <div className={`discover-card ${dataNum < 1 ? 'red' : dataNum > 1 ? '' : 'yellow'}`} data-percentage={dataNum + '%'}>
            <div className="discover-card-heading space-between ">
                <div className="space-between" style={{ gap: '.3rem' }}>
                    <Button
                        className="primary-button light-button space-between"
                        style={{ width: 'max-content', fontSize: 12 }}
                        variant="contained">
                        {props?.dex?.names} {/*<img src={Images} alt={"DEX"} className="token-icon" />*/}
                    </Button>
                    <div className="token-icon-wrap" >
                    </div>
                </div>
                <span></span>
            </div>
            <div className="discover-card-body">
                <div className="tokens-path-is">
                    <div className="space-between" style={{ width: '100%' }}>
                        <div className="discover-trade-amount-info-route">
                            <div className="trade-path-flow">
                                <img
                                    src={props?.paths?.[0]?.logoURI}
                                    alt={props?.paths?.[0]?.symbol}
                                    className="token-icon"
                                />
                                <span className="trade-amount space-between">
                                    {NumCompact(params?.arbitrade?.amountIn ?? "0.00")} {props?.paths?.[0]?.symbol}
                                </span>
                            </div>
                            <ArrowForward className="swap-icon" />
                            <div className="trade-path-flow">
                                <img
                                    src={props?.paths?.[props?.paths?.length - 1]?.logoURI}
                                    alt={props?.paths?.[props?.paths?.length - 1]?.symbol}
                                    className="token-icon"
                                />
                                <span className="trade-amount space-between">
                                    {precise(fmWei(outPut?.data as any, props?.paths?.[props?.paths?.length - 1]?.decimals))}
                                    {props?.paths?.[props?.paths?.length - 1]?.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="discover-card-footing space-between">
                <div className="discover-card-body">
                    <div className="tokens-path-is">{
                        props?.paths?.map((path) =>
                            <div className="token-icon-wrap" key={Math.random()}>
                                <img src={path?.logoURI} alt={path?.symbol} className="token-icon" />
                            </div>
                        )
                    }
                    </div>
                </div>
                {
                    outPut?.isError && <small className="red">
                        {'error '}
                    </small>
                }
                <Button
                    className="primary-button   light-button"
                    style={{ paddingInline: 12, fontSize: 12 }}
                    disabled={outPut?.isRefetching || outPut?.isError}
                >
                    {/* <span>*/ "Trade" /*</span> */}
                    {/* <Add /> */}
                </Button>
            </div>
        </div>
    )
}
import { Add, ArrowDownward, ArrowDropDown, ArrowRight, SwapHorizRounded } from '@mui/icons-material'
import { Box, Button, Divider } from '@mui/material/'
import { useNetwork, useContractRead } from 'wagmi'
import useWindowDimensions from '../../Hooks/useWindowDimensions'
import { Link, useSearchParams } from 'react-router-dom'
import { useADDR } from '../../Ethereum/Addresses'
import ContentModal from '../../Components/Modal'
import { useState } from 'react'
import { PRICE_ORACLE } from '../../Ethereum/ABIs/index.ts'
import { cut } from '../../Helpers'

export default () => {
    const { chain } = useNetwork()
    const { innerWidth } = useWindowDimensions()
    const [q, setSearchParams] = useSearchParams({ dex: 'uniswap', });
    const [sDxs, setSDxs] = useState(false)
    const ADDR = useADDR(chain?.id);

    const dex = (ADDR?.DEXS as any)?.filter((d: any) => d?.NAME?.includes((q.get('dex') as any)?.toLowerCase()?.replace(/[^a-zA-Z]+/g, '')))[0]

    const handleNewDexSelected = (dexname: string) => {
        setSDxs(false)
        setSearchParams({ page: q.get('page') as any, dex: dexname })
    }

    const { data: newPairs, } = useContractRead({
        'abi': PRICE_ORACLE,
        'functionName': 'getLastPair',
        'address': ADDR['PRICE_ORACLEA'],
        args: [dex?.FACTORY],
        watch: true
    })



    return (
        <div style={{ width: '100%', height: 'max-content' }} >
            <div className="page-navigator">
                <div className="space-between relative-container ">
                    <Button
                        onClick={() => setSDxs(o => !o)}
                        variant='contained'
                        style={{ padding: '.2rem' }}
                        className={`primary-button dark-button ${!dex?.NAME && 'error'}`}>
                        <img src={dex?.ICON} alt={dex?.SYMBOL} className="icon" />&nbsp;{dex?.NAME ?? `Invalid DEX`}&nbsp;<ArrowDropDown />
                    </Button>
                    <ContentModal shown={sDxs}>
                        <div className="flexed-tabs">
                            {
                                (ADDR?.DEXS as any)?.map((dex: any) => {
                                    if (!(dex?.NAME?.includes((q.get('dex') as any)?.toLowerCase()?.replace(/[^a-zA-Z]+/g, '')))) {
                                        return <Button
                                            onClick={() => handleNewDexSelected(dex?.NAME)}
                                            variant='contained' style={{ padding: '.2rem' }}
                                            className={`primary-button dark-button flexed-tab ${!dex?.NAME && 'error'}`}>
                                            <img src={dex?.ICON} alt={dex?.SYMBOL} className="icon" />&nbsp;{dex?.NAME ?? `Invalid DEX`}
                                        </Button>
                                    }
                                    return <></>
                                })
                            }
                        </div>
                    </ContentModal>
                </div>
                <div className="filter-input-wrapper">
                    <input className="input-reading"
                        onChange={() => { }}
                        placeholder='Filter by symbol, name, pair address...' />
                </div>
            </div>

            <div className="list-wrap">
                <ul className="ul list-ul">
                    <li className="list-li list-heading">

                    </li>

                    {
                        innerWidth <= 700 ? <h2 style={{ paddingInline: '1rem' }}>COMING SOON ON MOBILE</h2> : (
                            <>
                                <li className="list-li list-heading">
                                    <span className="heading-title">name</span>
                                    <span className="heading-title">liting date</span>
                                    <span className="heading-title">price {chain?.nativeCurrency?.symbol} &bull; USD</span>
                                    <span className="heading-title">LQ {chain?.nativeCurrency?.symbol}  &bull; token</span>
                                    <span className="heading-title">action</span>
                                </li>
                                <li className="list-li">
                                    <span className="list-li-title">- - -</span>
                                    <span className="list-li-title">- - -</span>
                                    <span className="list-li-title">- - -  &bull; - - -</span>
                                    <span className="list-li-title">- - -  &bull; - - -</span>
                                    <span className="list-li-title">
                                        <div className="space-between">
                                            <span></span>
                                            <div className="space-between">
                                                <a target="_balnk" href={`${chain?.blockExplorers?.default?.url}/address/${newPairs}`} >
                                                    <Button className=" primary-button">
                                                        {cut(newPairs)}<ArrowRight />
                                                    </Button>
                                                </a>
                                                <SwapHorizRounded />
                                            </div>
                                        </div>
                                    </span>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}
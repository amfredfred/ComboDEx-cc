import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import { DocumentScanner, ExploreOutlined, Height, People, RocketLaunch, SnippetFolder, StackedBarChart } from '@mui/icons-material';
import { motion } from 'framer-motion'
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import { IParams, Params } from "../../Defaulds";

const drawerWidth = 200;

export default function MiniDrawer() {

    const { innerWidth } = useWindowDimensions()
    const [open, setIsOpen] = useState(false)
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const setparams = (key: IParams['waitlist']['keys'], val: any) => {
        storeParams((p: any) => ({ ...p, waitlist: { ...p.waitlist, [key]: val } }))
    }
    const styles = {
        lb: {
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
        }
    }

    if (innerWidth <= 600) {
        return <></>
    }
    return (
        <div className='drawer-menu' >
            <motion.nav onMouseOver={() => setIsOpen(true)}
                onMouseOut={() => setIsOpen(false)}
                className="nav-main">
                {
                    open ?
                        <Link className="path-name" style={{ justifyContent: open ? 'flex-start' : 'center', paddingInline: open ? '1rem' : '.6rem' }} to={'/'}>Combodex</Link>
                        : <Link className="path-name" to={'/'}>YT</Link>

                }
                <div
                    style={{ flexWrap: 'wrap', display: 'flex', alignContent: 'space-between', height: '100%' }}>
                    <List className='nav-ul'>
                        {/* <ListItem key={'dashboard'} disablePadding className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'dashboard'}`} className='nav-link' >
                                    <DashboardIcon />
                                    <ListItemText primary={"Dashboard"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'account'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'shared-wallet'}`} className='nav-link' >
                                    <AccountBalanceIcon />
                                    <ListItemText primary={"Shared-Wallet"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem> */}

                        <ListItem key={'sniper'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'sniper'}`} className='nav-link' >
                                    <RocketLaunch />
                                    <ListItemText primary={"Snipe"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'arbitrade'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'arbitrade'}`} className='nav-link' >
                                    <StackedBarChart />
                                    <ListItemText className="nav-name" primary={"Arbitrade"} />
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'arbitrade'} className="nav-li" onClick={() => setparams('visible', true)}>
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`#`} className='nav-link' >
                                    🎁
                                    <ListItemText className="nav-name clock-wait" primary={"Free-COF"} />
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    </List>

                    <List className='nav-ul'>
                        <ListItem key={'help'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link target='_' to={`https:t.me/combodex_chat`} className='nav-link' >
                                    <People />
                                    <ListItemText primary={"Combo Chat"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'info'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link target='_blank' to={`https://combodex.gitbook.io/home/`} className='nav-link' >
                                    <DocumentScanner />
                                    <ListItemText primary={"DOC"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            </motion.nav>
        </div>
    )
}
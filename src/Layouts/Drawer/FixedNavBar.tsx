import List from '@mui/material/List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpCenterOutlined from '@mui/icons-material/HelpCenterOutlined'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import { DocumentScanner, ExploreOutlined, MenuOpenRounded, People, RocketLaunch, StackedBarChart } from '@mui/icons-material';
import useMouseUpEvent from '../../Hooks/useMouseUpEvent';
import useAssets from '../../Assets';
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import { IParams, Params } from "../../Defaulds";
export default function FixedNavBar() {
    const { innerWidth } = useWindowDimensions()
    const [open, setIsOpen] = useState(false)
    const mmenu = useRef<any>()
    const { rect_Logo } = useAssets('images') as any

    useMouseUpEvent(mmenu.current, () => setIsOpen(o => false), mmenu)
    const [params, storeParams] = useLocalStorage<IParams>('@Params', Params)
    const setparams = (key: IParams['waitlist']['keys'], val: any) => {
        storeParams((p: any) => ({ ...p, waitlist: { ...p.waitlist, [key]: val } }))
    }
    const styles = {
        lb: {
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            width: open ? '100%' : 'auto',
            backgroud: 'red'
        },
        lbl: {
            minWidth: 0,
            width: open ? '100%' : 'auto',
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '.6rem',
            paddingInline: '.6rem'
        }
    }

    if (innerWidth > 600) return <></>

    return (
        <div style={{ maxHeight: '90dvh' }} className={`drawer-main-mobile ${open ? 'mobile-menu-toggled' : ''}`} >
            {
                open && <a className='site-name' style={{ paddingInline: 10 }} href={window.location.href}>
                    <img src={rect_Logo} alt="" className="site-logo" />
                    {/* {innerWidth < 700 ? "YT" : window.location.pathname.replace('#/', '').replace('-', ' ')} */}
                </a>
            }

            <List ref={mmenu} className='drawer-main-mobile-lists'  >

                <ListItemButton sx={styles.lb} onClick={() => setparams('visible', true)} >
                    <Link to={`#`} className='nav-link' >
                        🎁
                        <ListItemText className="nav-name clock-wait" primary={"Free-COF"} />
                    </Link>
                </ListItemButton>

                <ListItemButton sx={styles.lb}    >
                    <Link to={`../${'dashboard'}`} style={styles.lbl}>
                        <DashboardIcon />
                        <ListItemText primary={"Dashboard"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>

                <ListItemButton sx={styles.lb}  >
                    <Link to={`../${'shared-wallet'}`} style={styles.lbl}>
                        <AccountBalanceIcon />
                        <ListItemText primary={"Shared Wallet"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>

                <ListItemButton sx={styles.lb}  >
                    <Link to={`../arbitrade`} style={styles.lbl}>
                        <StackedBarChart />
                        <ListItemText primary={"Arbitrade"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>


                <ListItemButton sx={styles.lb}  >
                    <Link to={`../${'snipper'}`} style={styles.lbl}>
                        <RocketLaunch />
                        <ListItemText primary={"Snipe"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>

                <ListItemButton sx={styles.lb}  >
                    <Link to={`https://t.me/combodex_chat`} style={styles.lbl}>
                        <People />
                        <ListItemText primary={"Combo Chat"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>


                <ListItemButton sx={styles.lb}  >
                    <Link to={`https://combodex.gitbook.io/home/`} style={styles.lbl}>
                        <DocumentScanner />
                        <ListItemText primary={"DOC"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>
            </List>
            <MenuOpenRounded onClick={() => setIsOpen(o => !o)} className='menu-toggle' />
        </div>
    );
}
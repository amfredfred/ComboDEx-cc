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
import { ExploreOutlined, MenuOpenRounded, RocketLaunch, StackedBarChart } from '@mui/icons-material';
import useMouseUpEvent from '../../Hooks/useMouseUpEvent';

export default function FixedNavBar() {
    const { innerWidth } = useWindowDimensions()
    const [open, setIsOpen] = useState(false)
    const mmenu = useRef<any>()
    useMouseUpEvent(mmenu.current, () => setIsOpen(o => false), mmenu)

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
                open && <Link className="path-name" style={{ justifyContent: 'flex-start', paddingInline: '1.6rem' }} to={'/'}>YieldTrinity</Link>
            }
            <List ref={mmenu} className='drawer-main-mobile-lists'  >
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
                    <Link to={`https://t.me/yieldTrinity`} style={styles.lbl}>
                        <HelpCenterOutlined />
                        <ListItemText primary={"Community"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>


                <ListItemButton sx={styles.lb}  >
                    <Link to={`../${'info'}`} style={styles.lbl}>
                        <InfoOutlinedIcon />
                        <ListItemText primary={"App info"} sx={{ opacity: open ? 1 : 0 }} />
                    </Link>
                </ListItemButton>
            </List>
            <MenuOpenRounded onClick={() => setIsOpen(o => !o)} className='menu-toggle' />
        </div>
    );
}
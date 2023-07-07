import List from '@mui/material/List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpCenterOutlined from '@mui/icons-material/HelpCenterOutlined'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import { ExploreOutlined, Height, RocketLaunch, SnippetFolder, StackedBarChart } from '@mui/icons-material';
import { motion } from 'framer-motion'

const drawerWidth = 200;

export default function MiniDrawer() {

    const { innerWidth } = useWindowDimensions()
    const [open, setIsOpen] = useState(false)
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
                        <Link className="path-name" style={{ justifyContent: open ? 'flex-start' : 'center', paddingInline: open ? '1rem' : '.6rem' }} to={'/'}>YieldTrinity</Link>
                        : <Link className="path-name" to={'/'}>YT</Link>

                }
                <div
                    style={{ flexWrap: 'wrap', display: 'flex', alignContent: 'space-between', height: '100%' }}>
                    <List className='nav-ul'>
                        <ListItem key={'dashboard'} disablePadding className="nav-li">
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
                        </ListItem>

                        <ListItem key={'snipper'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'snipper'}`} className='nav-link' >
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
                    </List>

                    <List className='nav-ul'>
                        <ListItem key={'help'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link target='_' to={`https:t.me/yieldTrinity`} className='nav-link' >
                                    <HelpCenterOutlined />
                                    <ListItemText primary={"Info"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem key={'info'} className="nav-li">
                            <ListItemButton sx={styles.lb}  >
                                <Link to={`../${'info'}`} className='nav-link' >
                                    <InfoOutlinedIcon />
                                    <ListItemText primary={"App info"} className="nav-name" />
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            </motion.nav>
        </div>
    )
}
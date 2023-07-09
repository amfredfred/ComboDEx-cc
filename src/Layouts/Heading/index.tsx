import { Box, Typography } from '@mui/material'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'
import { useNetwork } from 'wagmi'
import useWindowDimensions from '../../Hooks/useWindowDimensions'
import { motion } from 'framer-motion'
import useAssets from '../../Assets'


export default function Heading() {

    const { innerWidth } = useWindowDimensions()
    const { rect_Logo } = useAssets('images') as any

    return (
        <Box className='heading-main' style={{ position: 'sticky', top: 0 }}>
            <Box className="space-between">
                <div className="space-between">
                    <Typography component={'h1'}>
                        <a className='site-name' href={window.location.href}>
                            <img src={rect_Logo} alt="" className="site-logo" />
                            {/* {innerWidth < 700 ? "YT" : window.location.pathname.replace('#/', '').replace('-', ' ')} */}
                        </a>
                    </Typography>
                    {/* <motion.div animate={{ scale: [.75] }}> */}
                    {innerWidth > 600 && <Web3NetworkSwitch />}
                    {/* </motion.div> */}
                </div>
                {/* <motion.div animate={{ scale: [.75] }}> */}
                <Web3Button
                    avatar={'show'}
                    balance={'show'}
                    icon='show' />
                {/* </motion.div> */}
            </Box>
        </Box >
    )
}
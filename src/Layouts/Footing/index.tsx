import { Box, Button, Typography } from '@mui/material'
import {  useNetwork } from 'wagmi'
import useWindowDimensions from '../../Hooks/useWindowDimensions'


export default function Footing() {

    const network = useNetwork()
    const { innerWidth } = useWindowDimensions()

    return (
        <Box className='footing-main'>
            <Box className="space-between">
                {/* <div className="space-between">
                    <Button >
                        <a target='_' href="https://t.me/yieldTrinity">support</a>
                    </Button>
                </div> */}
                <small className=" small-text">
                    &copy; YieldTrinity {String(new Date().getFullYear())}
                </small>
            </Box>
        </Box>
    )
}
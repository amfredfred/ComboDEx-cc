import MiniDrawer from "../Drawer"
import { Box } from '@mui/material';
import Heading from "../Heading";
import Footing from "../Footing";
import FixedNavBar from "../Drawer/FixedNavBar";

export default ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <MiniDrawer />
            <Box component="main" className="main-container"  >
                <Heading />
                <Box className="main-content">
                    <Box className='main-centered'>
                        {children}
                    </Box>
                    <Footing />
                </Box>
                <FixedNavBar />
            </Box>
        </div>
    )
}
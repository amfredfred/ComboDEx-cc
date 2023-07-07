import { Button } from '@mui/material'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DropDown({ children, title, }: { children?: React.ReactNode, title?: React.ReactNode }) {
    const [shown, setshown] = useState<boolean>(false)
    const dropDownIteVariant = {
        opened: { y: 0, display: 'block' },
        closed: { y: -10, display: 'none' }
    }

    if (!Boolean(title)) {
        return <></>
    }

    const dropDownItems = (
        <motion.div animate={shown ? 'opened' : 'closed'}
            variants={dropDownIteVariant} className="drop-down-items">
            {children}
        </motion.div>
    )

    return (
        <div className="drop-down-wrapper">
            <div className="space-between">
                <Button className='primary-button drop-down-btn' onClick={() => setshown(state => !state)} variant='text'>
                    {title}
                    {/* <ArrowDownward /> */}
                </Button>
            </div>
            {dropDownItems}
        </div>
    )
}

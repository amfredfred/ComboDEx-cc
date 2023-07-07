import { useEffect, useState } from 'react'

export interface IWindowDimension {
    innerHeight: number
    outerHeight: number
    innerWidth: number
    outerWidth: number
}

export default function () {
    const [winDimensions, setwinDimensions] = useState<IWindowDimension>({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth
    })
    useEffect(() => {
        window.addEventListener('resize', (e) => {
            const dimension = e.target as Window
            setwinDimensions(old => old = {
                'innerHeight': dimension?.innerHeight,
                'innerWidth': dimension?.innerWidth,
                'outerHeight': dimension?.outerHeight,
                'outerWidth': dimension?.outerWidth
            })
        })
        return () => window.removeEventListener('resize', () => { })
    }, [])
    return { ...winDimensions }
}
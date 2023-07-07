import { useEffect } from 'react'
export default function useMouseUpEvent(ref: any, dosomehting: any, deps: any) {

    useEffect(() => {
        window.document.addEventListener('mouseup', (e: any) => {
            const menu = e.target
            if (ref?.current !== undefined)
                if (menu !== ref.current && !(ref.current?.contains(menu))) {
                    typeof dosomehting === 'function' && dosomehting()
                }
        })
        return () => window.document.removeEventListener('mouseup', (e: any) => { })
    }, [deps])
}
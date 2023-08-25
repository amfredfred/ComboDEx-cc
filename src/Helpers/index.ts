import { ethers } from 'ethers'

export const cut = (val: string | number | unknown, position: "middle" | "left" | "right" | undefined = "middle") => {
    const valz = String(val)
    switch (position) {
        case "left":
            if (valz.length <= 4) return valz
            return '...' + valz.slice(-4)
        case "middle":
            return valz.slice(0, 3) + '...' + valz.slice(-3)
        case "right":
            if (valz.length <= 4) return valz
            return valz.slice(0, 4) + '...'
    }
}

// precising/to fixed decimals places  
export const precise = (val: string | number = 0, decimals: undefined | number = 4): string => {
    let tofixed = Number(val ?? 0)?.toFixed?.(decimals + 1)
    let splitted0 = String(tofixed)?.split?.('.')[1]
    return tofixed?.split?.('.')?.[0]?.concat?.('.')?.concat?.(splitted0?.slice?.(0, decimals))
}


// is a valid address
export const isAddress = (val: string) => ethers.utils.isAddress(String(val))


// wait/sleep
export const wait = /*@devfred*/ async (seconds?: number) => new Promise((resolved) => setTimeout(() => resolved('continue'), Number(seconds) * 1000 || 1000))

// to big number
export const toBN = (val: string | number): ethers.BigNumber => ethers.BigNumber.from(val)

// fromart numbers in k`s
export const NumCompact = (val: number | string): string => Intl.NumberFormat("en", { notation: "compact" }).format(Number(val))

// percentage of off
export const percentageof = (perc: number | string, num: number | string): number => Number(num) * (Number(perc) / 100)

export const strEqual = (val: string, val2: string) => val?.toLowerCase() == val2?.toLowerCase()


export const toLower = (val: string) => val?.toLocaleLowerCase()
// from wei
export const fmWei = (val: string | number, decimals: undefined | string | number = 18): string => {
    if (!val) return precise(0)
    return ethers.utils.formatUnits(String(val), decimals)
}

// to wei
export const toWei = (val: string | number, decimals: any = 18): ethers.BigNumber | number => {
    if (!val || !decimals) return ethers.utils.parseUnits(String(0), 18)
    return ethers.utils.parseUnits(String(val), decimals)
}

export const encodeFunctionCall = (funcName: string, abi: any, params: any): any => {
    if (!Boolean(funcName) || !Boolean(abi) || !Boolean(params)) return '0x0'
    return new ethers.utils.Interface(abi).encodeFunctionData(funcName, params);
}

export const sub = (val: string | number, val2: string | number) => Number(val) - Number(val2)

// price difference
export const priceDifference = (val: string | number, val2: string | number): { subtract: any, percentage: any } => {
    const oldp = Number(val)
    const newp = Number(val2)
    const subtract = sub(oldp, newp);
    const addition = (oldp + newp) / 2
    const division = subtract / addition
    const percentage = (division * 100).toFixed(2)
    return { subtract, percentage }
}
//@devfred


export const notify = () => {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Hi there!");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification("Hi there!");
                // …
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}


//



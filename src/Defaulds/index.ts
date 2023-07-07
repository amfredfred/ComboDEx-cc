import { SHARED_WALLET as SABI } from "../Ethereum/ABIs/index.ts"

export interface IArbitrade {
    setparams(key: IParams['arbitrade']['keys'], val: any): void
}

export interface ISnipperParams {
    setparams(key: IParams['snipper']['keys'], val: any): void
    settings(old: (state: boolean) => boolean): void
    dexes(old: (state: boolean) => boolean): void,
}

export interface ISettings {
    shown: boolean,
    selected: any,
    toggle: ISnipperParams['settings'],
    onSelect(dexname: string): void,
}

export interface ISnipperSettings extends ISettings {
    setparams: ISnipperParams['setparams']
}

export interface IArbitradeSettings extends IArbitrade {
    shown: boolean,
    toggle: ISnipperParams['settings'],
}


export interface IModal {
    shown: boolean,
    children: React.ReactNode,
    onModalClose?: Function,
    position?: 'right' | 'left' | 'center' | 'middle'
}

export interface IContentModal extends IModal {
    shown: boolean,
    selected: any,
    toggle: ISnipperParams['settings'],
    onSelect(dexname: string): void
}

export interface IArbitradeRouteBuilder {
    amount: number,
    dex: any
    dexId: number
    onRemove(dexId: number): void
    onShowDexes(old: (state: boolean) => boolean): void
    onShowTokens(old: (state: boolean) => boolean): void
    setParams: IArbitrade['setparams']
}

export interface ITokenInfo {
    logoURI: string
    address: string
    name: string
    symbol: string
    decimals: number
}

export interface IDex {
    router: string
    FACTORY: string
    ICON: string
    NAME: string
    SYMBOL: string
    paths: [ITokenInfo]
    output: any
}

export interface IMultiPathTranactionBuillder {
    _paths: string[]
    _pathLengths: number[]
    _routes: string[]
    _inputes: number[]
    _minOutputs: number[]
    _deadline: number
}

export interface IOpportunityCard {
    paths: [ITokenInfo]
    difference: {
        potnetialProfit: number,
        percentage: number
    }
    dex: {
        router: string
        factory: string
        names: string
    }
    path: number
    pathFiltered: string[]
    pathName: string[]
    amountIn: number
    amountOut: number
    chainId: number
    createdAt: {
        relative: string
        absolute: Date
    }
    updatedAt: {
        relative: string
        absolute: Date
    }
}

export interface IParams {
    snipper: {
        keys: 'autoFetchLastPair' | 'dex' | 'pair' | 'pair' | 'mode' | 'dataDisplay' | 'inPosition' | 'takeProfit'
        | 'lasBuyPrice' | 'lastSellPrice' | 'lastBuyTime' | 'takeProfitPercentage' | 'pushNotificationEnabled' | 'triangular'
        autoFetchLastPair: boolean
        pair: any
        dex: string
        mode: 'mini' | 'full' | 'small',
        dataDisplay: 'variants' | 'transactions' | 'pool'
        inPosition: boolean
        takeProfit: boolean
        takeProfitPercentage: number,
        autoBuy: boolean
        lasBuyPrice: number
        lastSellPrice: number
        lastBuyTime: number
        pushNotificationEnabled: boolean
        triangular: boolean
    }

    arbitrade: {
        keys: 'dexes' | 'currentDexId' | 'amountIn' | 'settings'
        currentDexId: number
        amountIn: number
        dexes?: [IDex]
        settings?: {
            auto?: boolean
        }
    }

    waitlist: {
        keys: "visible" | "account"
        visible: boolean
    }

    user: {
        referee?: string | undefined | null
    }
}

export const Params: IParams = {
    snipper: {
        keys: 'dex',
        autoFetchLastPair: false,
        pair: '',
        dex: 'pancakeswap',
        mode: 'mini',
        dataDisplay: 'variants',
        inPosition: false,
        takeProfit: false,
        autoBuy: false,
        lasBuyPrice: 0,
        lastSellPrice: 0,
        lastBuyTime: 0,
        takeProfitPercentage: 10,
        pushNotificationEnabled: false,
        triangular: false
    },
    arbitrade: {
        keys: 'dexes',
        currentDexId: 0,
        amountIn: 1,
        dexes: [] as any
    },

    waitlist: {
        keys: "visible",
        visible: false
    },
    user: {
        referee: ''
    }
}

export interface IContractRead {
    functionName: string,
    abi: typeof SABI,
    address: string | any
    args?: any
}
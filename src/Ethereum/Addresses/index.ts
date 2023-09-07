import { useNetwork } from "wagmi"
import UniswapIcons from '../../Assets/image/Uniswap_Logo.svg.png'
import PancakeSwapIcons from '../../Assets/image/pancakeswap-cake-logo.png'
import SushiSwapIcons from '../../Assets/image/sushiswap-logo.png'
import QuickswapIcons from '../../Assets/image/quickswap-icon.jpg'
import ApeSwapIcons from '../../Assets/image/apeswap.png'
import { tokensList, ITokens } from "../TokensList";
import { ITokenInfo } from "../../Defaulds"

enum NETWORKS {
    AVAX = 43114,
    FANTOM = 250,
    ETH = 1,
    AETH = 42161,
    BSC_TESTNET = 97
}

export interface IAddresses {
    SHARED_WALLET: any
    PRICE_ORACLEA: any
    WETH_ADDRESSA: any
    TOKENS: ITokens[]
    COMBO_HELPER: any
    COMBO_TOKEN: any
    DEXS: {
        router: string
        FACTORY: string
        ICON: string
        NAME: string
        SYMBOL: string
    }[]
}

const AVAILABLE_CHAINS = [NETWORKS.AVAX, NETWORKS.FANTOM, NETWORKS.ETH, NETWORKS.AETH, NETWORKS.BSC_TESTNET];

const ETH_MAINNET: IAddresses = {
    SHARED_WALLET: "",
    PRICE_ORACLEA: "",
    WETH_ADDRESSA: "",
    TOKENS: tokensList[1],
    COMBO_HELPER: "",
    COMBO_TOKEN: "",
    DEXS: [
        {
            router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
            ICON: UniswapIcons,
            NAME: 'uniswap',
            SYMBOL: 'UNI'
        },
        {
            router: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
            FACTORY: "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
            ICON: PancakeSwapIcons,
            NAME: 'pancakeswap',
            SYMBOL: 'CAKE'
        },
        {
            router: "0x5f509a3C3F16dF2Fba7bF84dEE1eFbce6BB85587",
            FACTORY: "0xBAe5dc9B19004883d0377419FeF3c2C8832d7d7B",
            ICON: ApeSwapIcons,
            NAME: 'apeswap',
            SYMBOL: 'banana'
        },
    ]
}

const POLYGON_MAINNET: IAddresses = {
    SHARED_WALLET: "",
    PRICE_ORACLEA: "0x7f379eC5914476D919E1F38bC904FC07A49b3A2D",
    WETH_ADDRESSA: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    TOKENS: tokensList[137],
    COMBO_HELPER: "",
    COMBO_TOKEN: "",
    DEXS: [
        {
            router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            FACTORY: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
            ICON: QuickswapIcons,
            NAME: 'quickswap',
            SYMBOL: 'quick'
        },
        {
            router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
            FACTORY: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            ICON: SushiSwapIcons,
            NAME: 'sushiswap',
            SYMBOL: 'sushi'
        }, {
            router: "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607",
            FACTORY: "0xCf083Be4164828f00cAE704EC15a36D711491284",
            ICON: ApeSwapIcons,
            NAME: 'apeswap',
            SYMBOL: 'banana'
        },
    ]
}

const BSC_MAINNET: IAddresses = {
    SHARED_WALLET: "",
    PRICE_ORACLEA: "0x1b126D03A4Ac53Fb37Aef0b0D78D24d45700ccAA", // OLD = 0x7f379eC5914476D919E1F38bC904FC07A49b3A2D // Old New 0xBf8623ccc1Addd21c6FB578d629EB31F6FD35802
    WETH_ADDRESSA: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    TOKENS: tokensList[56],
    COMBO_HELPER: "0x12676cD5aC9f440339683B862D7CA46d4dAc798F",
    COMBO_TOKEN: "0x9D2e5306212e31d5bB5e81FEA5440156aA769281",
    DEXS: [
        {
            router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
            FACTORY: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            ICON: SushiSwapIcons,
            NAME: 'sushiswap',
            SYMBOL: 'sushi'
        },
        {
            router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            FACTORY: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
            ICON: PancakeSwapIcons,
            NAME: 'pancakeswap',
            SYMBOL: 'cake'
        },
        {
            router: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
            FACTORY: "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6",
            ICON: ApeSwapIcons,
            NAME: 'apeswap',
            SYMBOL: 'banana'
        },
    ]
}

const BSC_TESTNET: IAddresses = {
    SHARED_WALLET: "0xE66B70549FDc0278877E91D007E33d5b6A32b682",
    PRICE_ORACLEA: "0x0Ac4C22AefAB3C8b0A9ca7A0Dc77E825709A0Cb7",
    WETH_ADDRESSA: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    COMBO_HELPER: "0x2a291871aDa44f7eFdA87460407b26715D6e207A",
    COMBO_TOKEN: "0xAc288BE58C21Da2E07eFF47fD6858c8Ef32E9238",
    TOKENS: tokensList[97],
    DEXS: [
        {
            router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
            FACTORY: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            ICON: UniswapIcons,
            NAME: 'uniswap',
            SYMBOL: 'UNI'
        },
        {
            router: "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3",//0xD99D1c33F9fC3444f8101754aBC46c52416550D1
            FACTORY: "0x6725f303b657a9451d8ba641348b6761a6cc7a17",
            ICON: PancakeSwapIcons,
            NAME: 'pancakeswap',
            SYMBOL: 'CAKE'
        },
    ]
}

const ADDRESSES = {
    [97]: BSC_TESTNET,
    [56]: BSC_MAINNET,
    [1]: ETH_MAINNET,
    [137]: POLYGON_MAINNET
}


export const useADDR = (chainID?: number | undefined): IAddresses => {
    const { chain } = useNetwork()
    return (ADDRESSES as any)?.[AVAILABLE_CHAINS[chainID as number]] ?? (ADDRESSES as any)?.[(chain as any)?.id] ?? ADDRESSES[97]
}
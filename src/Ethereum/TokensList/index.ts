export interface ITokens {
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

const ETH_MAINNET: ITokens[] = [
    {
        "address": "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
        "name": "ApeCoin",
        "symbol": "APE",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455",
    }, {
        "name": "Tether USD",
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "symbol": "USDT",
        "decimals": 6,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    }
]

const POLYGON_MAINNET: ITokens[] = [
    { "address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "name": "Tether USD (POS)", "symbol": "USDT", "decimals": 6, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
    { "address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "name": "Dai Stablecoin (PoS)", "symbol": "DAI", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg" },
    { "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "name": "USD Coin (PoS)", "symbol": "USDC", "decimals": 6, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
    {
        "address": "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        "name": "Quickswap",
        "symbol": "QUICK",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/13970/thumb/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659",
    },
    {
        "name": "Wrapped Ether",
        "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        "symbol": "WETH",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {
        "name": "Wrapped Matic",
        "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "symbol": "WMATIC",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
    },
    {
        "address": "0xB7b31a6BC18e48888545CE79e83E06003bE70930",
        "name": "ApeCoin",
        "symbol": "APE",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455",
    }
]

const BSC_MAINNET: ITokens[] = [
    {
        "name": "BTCB",
        "address": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
        "symbol": "BTCB",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    },
    {
        "name": "Tether USD",
        "address": "0x55d398326f99059fF775485246999027B3197955",
        "symbol": "USDT",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
        "address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "name": "Wrapped BNB",
        "symbol": "WBNB",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
    },
    { "address": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", "name": "USDC Token", "symbol": "USDC", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
    { "address": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", "name": "BUSD Token", "symbol": "BUSD", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
    {
        "address": "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
        "name": "Aave",
        "symbol": "AAVE",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png",
    },
    {
        "name": "Dai Stablecoin",
        "address": "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
        "symbol": "DAI",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    }
]

const BSC_TESTNET: ITokens[] = [
    { "address": "0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8", "name": "BTCB Token", "symbol": "BTCB", "decimals": 18, "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/2837.png" },
    { "address": "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867", "name": "Dai Token", "symbol": "DAI", "decimals": 18, logoURI: "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg" },
    { "address": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", "name": "USDT Token", "symbol": "USDT", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
    { "address": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", "name": "WBNB Token", "symbol": "WBNB", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_wbtc.svg" },
    { "address": "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7", "name": "BUSD Token", "symbol": "BUSD", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg" },
]

export const tokensList: { [key: number]: ITokens[] } = {
    [97]: BSC_TESTNET,
    [56]: BSC_MAINNET,
    [1]: ETH_MAINNET,
    [137]: POLYGON_MAINNET
}   

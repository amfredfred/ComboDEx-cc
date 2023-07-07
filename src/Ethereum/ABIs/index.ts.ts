// import PriceOracleAbi from '../../Constants/price-oracle-abi.json'
// import SharedWalletAbi from '../../Constants/shared-wallet-abi.json'
// export const SHARED_WALLET = SharedWalletAbi 
// export const PRICE_ORACLE = PriceOracleAbi


export const SHARED_WALLET = [
    "function deposit(uint256 _lockPeriod) payable",
    "function withdraw(uint256 amount)",
    "function borrowall()",
    "function ownershipPercentage(address user) public view returns (uint256)",
    "function conspectus(address user) public view returns (uint256)",
    "function minLockPeriod() public view returns (uint256)",
    "function lockMyFunds(address _accoount)  public view returns (uint256)",
    "function contribute(address user) public view returns (uint256)",
    "function owner () public view returns (address)",
    "function withdrawalFee () public view returns (uint256)",
    "function dilutedEarning(address user) view returns (uint256)",
    "function potentialEarn(address user) view returns (uint256)",
    "function getTokenPairReserves(address pairAddress) public  view returns (uint256 token0Reserve, uint256 reserve1Reserve)",
    "function getTokenFromPair( address pair  ) public view returns (address tokenAddress, bool isValid)",
    "function getTokenPriceInWETH( address _token  ) public view returns (uint256 priceInWETH)",
    " function getTokenPriceInUSDT(  address _token  ) public view returns (uint256 priceInUSDT)",
    "function decimals() public view returns (uint256)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function hasLiquidity(  address _token1,  address _token2  ) public view returns(bool hasliquidity)"
]


export const PRICE_ORACLE = [
    "function decimals() public view returns (uint256)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function transfer(address _to, uint256 _value)",
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender)  external  view   returns(uint256)",
    "function quotes(address _router, address _token1, address _token2, address _factory, uint256 _amount) external view returns(uint256 currentPrice)",
    "function quoteByPair(address _router, address _pair, uint256 _amount, address _factory) external view returns(uint256 currentQuote)",
    "function getPathForToken(address tokenIn, address tokenOut) external pure returns(address[] memory)",
    "function getLastPrice(address _token1, address _token2, address _route, address _factory) external view returns(uint256 lastRate)",
    "function priceInWETH(address _token, address _router, address _factory) external view returns(uint256 price)",
    "function priceInUSDT(address _token, address _router, address _factory) external view returns(uint256 price)",
    "function getLastPair(address _factory) external view returns(address pair)",
    "function predictFuturePrices(address[] calldata routes, address[] calldata path, uint256 amountIn) external view returns(uint256[] memory prices)",
    "function _predictPrice(address _route, address[] memory path, uint256 _amount) external view returns(uint256 price)",
    "function hasLiquidity(address _token1, address _token2,address _factory) public view returns(bool hasliquidity)",
    "function tokensLiquidity(  address _token1,  address _token2, address _factory  ) public view returns(uint256 base, uint256 token)",
    "function getTokenFromPair(address _pair) public  view  returns(address tokenAddress, bool isValid)",
    // "function getTokenInfo(address _token) public  view returns(TokenInfo memory)",
    "function getTokenPriceInWETH( address _token  ) public view returns (uint256 priceInWETH)",
    `function multiPathSwap(
        address[] calldata _paths,
        uint256[] calldata _pathLengths,
        address[] calldata  _routes,
        uint256[] calldata  _inputes,
        uint256[] calldata _minOutputs,
        uint256 _deadline 
    ) public payable`,
    "function priceImpacts( address _token0, address _token1, address[] memory _fatories, uint256 amount) public view returns(uint256[] memory impacts)",
    "function getTokenPairReserves(address _pair, address _factory) public  view returns(uint256 token0Reserve, uint256 reserve1Reserve)",
    "function getTokensFromPair(address _pair)    public   view  returns(address token0, address token1)",
    "function getRouteOutputs(address[] calldata routes, address[] calldata path, uint256 amountIn ) public view returns (uint256[] memory outputs)",
    "function priceInToken(address _token0,   address _token1,  address _router,  address _factory ) public view returns(uint256 price)",
    "function swap(address[] calldata _path, uint256 _amountIn, uint256 _minAmountOut, address _router, uint256 _deadline) public payable",
    "function _getRouteOutput( address route,  address[] calldata path,   uint256 amountIn ) public view returns(uint256)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
]
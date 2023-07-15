// import PriceOracleAbi from '../../Constants/price-oracle-abi.json'
// import SharedWalletAbi from '../../Constants/shared-wallet-abi.json'
// export const COMBO_ABIs = SharedWalletAbi 
// export const COMBO_ABIs = PriceOracleAbi

const User =
    `
        address userAddress,
        uint256 tokensClaimed,
        uint256 referrals,
        address[] downlines,
        uint256 claimTIme,
        uint256[] entryTimes,
        uint256 tokensBought,
        uint256 ethContribution,
        `


export const COMBO_ABIs = [
    //SHARED WALLET
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
    "function getTokenFromPair( address pair  ) public view returns (address tokenAddress, bool isValid)",
    " function getTokenPriceInUSDT(  address _token  ) public view returns (uint256 priceInUSDT)",
    "function decimals() public view returns (uint256)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function hasLiquidity(  address _token1,  address _token2  ) public view returns(bool hasliquidity)",

    //Price Oracle
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
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",

    //ComboFlex Helper
    "function _maxDownlines() external view returns(uint256)",
    "function _uplinecommision() external view returns(uint256)",
    "function _amountClaimable() external view returns(uint256)",
    "function _freebieEndDate() external view returns(uint256)",
    "function _freebieStartDate() external view returns(uint256)",
    "function _mintkns() external view returns(uint256)",
    "function _maxtkns() external view returns(uint256)",
    "function _icoStartDate() external view returns(uint256)",
    "function _icoEndDate() external view returns(uint256)",
    "function _rate() external view returns(uint256)",
    "function comboflex() external view returns(address)",
    `  function leadboard(
        address user
    )
        external
        view
        returns (
            address userAddress,
            uint256 tokensClaimed,
            uint256 referrals,
            address[] memory downlines,
            uint256 claimTIme,
            uint256[] memory entryTimes,
            uint256 tokensBought,
            uint256 ethContribution
        )`,
    "function getLeaderboardSize() external view returns(uint256)",
    "function getMyPosition() external view returns (uint256 position)",
    "function getLeaderboardEntry(uint256 index) external view returns(address, uint256, uint256)",
    "function _ethContributions() external view returns (uint256)",
    "function claimCombodexAirdrop(address referrer) external",
    "function buyComboFlex() external payable",

    //ComboFlex Tokens
    "function _minSupply() external view returns(uint256)",
    "function _initialSupply() external view returns(uint256)",
    "function _totalSupply() external view returns(uint256)",
    "function _feePercentage() external view returns(uint256)",
    "function _maxBalancePerAccount() external view returns(uint256)",
    "function _denominatror() external view returns(uint256)",
    "function _taxEnabled() external view returns(bool)",
    "function _initialized() external view returns(bool)",
    "function weth_cof_pair() external view returns(address)",
    "function _dexrouter() external view returns(address)",
    "function _insurer() external view returns(address payable)",
    "function _helper() external view returns(address payable)",
    "function _treasury() external view returns(address payable)"
]
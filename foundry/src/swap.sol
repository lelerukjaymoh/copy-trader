// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

interface IPancakePair {
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external;

    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IWETH {
    function deposit() external payable;
}

contract Sandwicher {
    address private immutable owner; // owner address set here always get cleared, guess its because storage gets cleared on every deploy.

    constructor() {
        owner = msg.sender;
    }

    // Buy 00000000
    function ROOT4146650865() external onlyOwner {
        address tokenIn;
        address tokenOut;
        address pairAddress;
        uint128 amountIn;

        // extract buy parameters using shr()
        assembly {
            tokenIn := shr(96, calldataload(0x4)) // 4 20
            tokenOut := shr(96, calldataload(0x18)) // 24 20
            pairAddress := shr(96, calldataload(0x2C)) // 44 20
            amountIn := shr(128, calldataload(0x2c)) // 44
        }

        IPancakePair pair = IPancakePair(pairAddress);
        bool inputTokenIsToken0 = _checkInputTokenIsToken0([tokenIn, tokenOut]);
        IERC20 _tokenIn = IERC20(tokenIn);

        _swap(amountIn, _tokenIn, pair, inputTokenIsToken0);
    }

    // withdraw 00000008
    // withdraw any amount of tokens from the contract
    function w_206AD7B5(
        address token,
        uint256 amount,
        address receiver
    ) external onlyOwner returns (bool) {
        return IERC20(token).transfer(receiver, amount);
    }

    // _() 0x0000035f)
    // withdraw all eth in the contract
    function _f2l() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "01");
        _;
    }

    function _swap(
        uint256 amountIn,
        IERC20 tokenIn,
        IPancakePair pair,
        bool inputTokenIsToken0
    ) internal {
        // fetch reserves
        (uint256 reserveIn, uint256 reserveOut) = _getreserves(
            pair,
            inputTokenIsToken0
        );

        // Transfer the amountIn to the pair
        tokenIn.transfer(address(pair), amountIn);

        uint actualAmountIn = tokenIn.balanceOf(address(pair)) - reserveIn;
        uint amountOut = _getAmountOut(actualAmountIn, reserveIn, reserveOut);

        // sort amount0Out and amount1Out
        (uint256 amount0Out, uint256 amount1Out) = inputTokenIsToken0
            ? (uint256(0), amountOut)
            : (amountOut, uint256(0));

        pair.swap(amount0Out, amount1Out, address(this), new bytes(0));
    }

    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        // Save gas by splitting same require statements into seperate
        require(amountIn > 0, "I"); // UniswapV2Library 1: INSUFFICIENT_INPUT_AMOUNT
        require(reserveIn > 0, "l"); //  // "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        require(reserveOut > 0, "L"); // "UniswapV2Library: INSUFFICIENT_LIQUIDITY"

        uint256 amountInWithFee = amountIn * 9975; // hardcode fee cause we only be using pancakeswap

        // Skip MSTOREs (by not specifying the numerator and denominator) to save 20 gas units
        amountOut =
            (amountInWithFee * reserveOut) /
            ((reserveIn * 10000) + amountInWithFee);
    }

    // Sorts tokens and returns if the input token is the token0, to be used later on swapping
    function _checkInputTokenIsToken0(
        address[2] memory tokens
    ) internal pure returns (bool inputTokenIsToken0) {
        address tokenIn = tokens[0];
        address tokenOut = tokens[1];

        (address token0, ) = _sortTokens(tokenIn, tokenOut);
        (inputTokenIsToken0) = tokenIn == token0 ? true : false;
    }

    // No need of sorting token0 and token1, uses previous sort result that is got from the _checkInputTokenIsToken0()
    // the idea behind this is if the tokens were sorted on a free static call why sort them again on a paid tx
    // saves gas on token0 sort and also on the tokenIn == token0 check, since bool checks are cheaper
    function _getreserves(
        IPancakePair pair,
        bool inputTokenIsToken0
    ) internal view returns (uint112 reserveA, uint112 reserveB) {
        (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();
        (reserveA, reserveB) = inputTokenIsToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    /**
     Sort tokens

        Assumptions done: (to save gas)
        - the tokens wont be identical
        - token0 wont be the zero address
        - this two checks are not done
    */

    function _sortTokens(
        address tokenA,
        address tokenB
    ) internal pure returns (address token0, address token1) {
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
    }

    receive() external payable {
        IWETH(0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c).deposit{
            value: msg.value
        }();
    }
}

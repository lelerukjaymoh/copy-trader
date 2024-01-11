// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function decimals() external view returns (uint8);
}

interface IPancakePair {
    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

interface IUniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

interface Idata {
    struct DataResult {
        uint256 accountBalance;
        uint256 tokenDecimals;
        uint estimantedTokenOut;
    }
}

contract Data is Idata {
    IUniswapV2Factory factory =
        IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // uniswap v2 factory
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function myTest() external pure returns (uint) {
        return 1;
    }

    function getData(
        address account,
        address tokenIn,
        address tokenOut,
        uint amountIn
    ) external view returns (DataResult memory dataResult) {
        address token = tokenIn == weth ? tokenOut : tokenIn;

        dataResult.accountBalance = IERC20(token).balanceOf(account);
        dataResult.tokenDecimals = IERC20(token).decimals();

        IPancakePair pair = IPancakePair(factory.getPair(tokenIn, tokenOut));

        bool inputTokenIsToken0 = _checkInputTokenIsToken0([tokenIn, tokenOut]);

        (uint256 reserveIn, uint256 reserveOut) = _getreserves(
            pair,
            inputTokenIsToken0
        );

        dataResult.estimantedTokenOut = _getAmountOut(
            amountIn,
            reserveIn,
            reserveOut
        );
    }

    function _checkInputTokenIsToken0(
        address[2] memory tokens
    ) internal pure returns (bool inputTokenIsToken0) {
        address tokenIn = tokens[0];
        address tokenOut = tokens[1];

        (address token0, ) = _sortTokens(tokenIn, tokenOut);
        (inputTokenIsToken0) = tokenIn == token0 ? true : false;
    }

    function _sortTokens(
        address tokenA,
        address tokenB
    ) internal pure returns (address token0, address token1) {
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
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

        uint256 amountInWithFee = amountIn * 9970; // TODO: Change the hardcoded fee match the fee on uniswap v2

        // Skip MSTOREs (by not specifying the numerator and denominator) to save 20 gas units
        amountOut =
            (amountInWithFee * reserveOut) /
            ((reserveIn * 10000) + amountInWithFee);
    }

    function _getreserves(
        IPancakePair pair,
        bool inputTokenIsToken0
    ) internal view returns (uint112 reserveA, uint112 reserveB) {
        (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();
        (reserveA, reserveB) = inputTokenIsToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }
}

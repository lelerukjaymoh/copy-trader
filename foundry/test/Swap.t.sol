// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Test.sol";
import {Swapper, IERC20} from "@src/Swap.sol";

contract TestSwapper is Test {
    // test setup
    Swapper swapper;
    address token = 0x2a8d8fcb18d132d77373eb02b22d8e7d378F4437;
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function setUp() external {
        string memory rpc = "https://rpc.ankr.com/eth";
        vm.createSelectFork(rpc, 18934667);

        address[] memory owners = new address[](3);
        owners[0] = makeAddr("owner1");
        owners[1] = makeAddr("owner2");
        owners[2] = makeAddr("owner3");

        swapper = new Swapper(owners);
    }

    /**
     * onlyowner
     */

    function testOnlyOwner() external {
        vm.expectRevert(Swapper.Unauthorized.selector);
        vm.startPrank(makeAddr("not_owner"));
        swapper.a_b4Y(makeAddr("test"), makeAddr("test"), 1 ether);
        vm.stopPrank();
    }

    function testBuy() external {
        address tokenIn = weth;
        address tokenOut = token;
        uint amountIn = 1e16;

        deal(tokenIn, address(swapper), 1 ether);
        vm.startPrank(makeAddr("owner1"));

        uint tokenBalanceBeforeSwap = IERC20(tokenOut).balanceOf(
            address(swapper)
        );

        swapper.a_b4Y(tokenIn, tokenOut, amountIn);

        uint tokenBalanceAfterSwap = IERC20(tokenOut).balanceOf(
            address(swapper)
        );

        console.log(
            "token balances : %s",
            tokenBalanceBeforeSwap,
            tokenBalanceAfterSwap
        );

        assertGt(tokenBalanceAfterSwap, tokenBalanceBeforeSwap);
        vm.stopPrank();
    }

    function testSell() external {
        address tokenIn = token;
        address tokenOut = weth;
        uint amountIn = 1e16;

        deal(tokenIn, address(swapper), 1 ether);

        uint wethBalanceBeforeSwap = IERC20(tokenOut).balanceOf(
            address(swapper)
        );

        vm.startPrank(makeAddr("owner1"));
        swapper.a_b4Y(tokenIn, tokenOut, amountIn);
        vm.stopPrank();

        uint wethBalanceAfterSwap = IERC20(tokenOut).balanceOf(
            address(swapper)
        );

        console.log(
            "token balances : %s",
            wethBalanceBeforeSwap,
            wethBalanceAfterSwap
        );

        assertGt(wethBalanceAfterSwap, wethBalanceBeforeSwap);
    }

    // withdraw tokens
    function testWithdrawTokens() external {
        deal(token, address(swapper), 1 ether);
        uint amount = IERC20(token).balanceOf(address(swapper));
        vm.startPrank(makeAddr("owner1"));
        swapper.b_1bt(token, amount, makeAddr("owner1"));
        vm.startPrank(makeAddr("owner1"));

        assertEq(IERC20(token).balanceOf(address(swapper)), 0);
        assertEq(IERC20(token).balanceOf(makeAddr("owner1")), amount);
    }

    // withdraw eth
    function testWithdrawEth() external {
        vm.deal(address(swapper), 1 ether);
        uint amount = address(swapper).balance;

        vm.startPrank(makeAddr("owner1"));
        swapper._f2l();
        vm.stopPrank();

        assertEq(address(swapper).balance, 0);
        assertEq(makeAddr("owner1").balance, amount);
    }

    // add owner
    function testAddOwner() external {
        vm.startPrank(makeAddr("owner1"));
        swapper.a_CaQ(makeAddr("owner4"));
        vm.stopPrank();

        assertEq(swapper.owners(makeAddr("owner4")), true); // REVEIEW: For this assert to work owners in Swapper should be converted to public
    }
}

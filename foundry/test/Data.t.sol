// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Test.sol";
import {Data} from "@src/Data.sol";

contract TestData is Test {
    Data data;
    address token = 0x2a8d8fcb18d132d77373eb02b22d8e7d378F4437;
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Log(bytes);

    function setUp() external {
        string memory rpc = "https://rpc.ankr.com/eth";
        vm.createSelectFork(rpc);

        data = new Data();
    }

    function testDataResult() external {
        address account = makeAddr("test");
        address tokenIn = weth;
        address tokenOut = token;
        uint amountIn = 1 ether;

        deal(token, account, 1 ether);

        Data.DataResult memory dataResult = data.getData(
            account,
            tokenIn,
            tokenOut,
            amountIn
        );

        uint[] memory expectedAmountsOut = new uint[](2);
        expectedAmountsOut[0] = 1000000000000000000;
        expectedAmountsOut[1] = 80263505441121298974353;

        console.log("account balance ", dataResult.accountBalance);
        console.log("token decimals ", dataResult.tokenDecimals);
        console.log("estimanted token out ", dataResult.estimantedTokenOut);

        assertEq(dataResult.accountBalance, 1 ether);
        assertEq(dataResult.tokenDecimals, 18);
        assertEq(dataResult.estimantedTokenOut, expectedAmountsOut[1]);

        bytes memory bytecode = abi.encodePacked(
            vm.getDeployedCode("Data.sol:Data")
        );

        emit Log(bytecode);
    }
}

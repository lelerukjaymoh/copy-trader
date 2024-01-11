// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.0;

contract MyTest {
    constructor(uint a, uint b) {
        uint c = a + b;

        bytes memory _abiEncodedData = abi.encode(c);

        assembly {
            // Return from the start of the data (discarding the original data address)
            // up to the end of the memory used
            let dataStart := add(_abiEncodedData, 0x20)
            return(dataStart, sub(msize(), dataStart))
        }
    }
}

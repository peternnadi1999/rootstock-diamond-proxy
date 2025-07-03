// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/DiamondStorage.sol";

contract Diamond {
    using DiamondStorage for DiamondStorage.DiamondStorageStruct;

    constructor(address _diamondCutFacet) {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        ds.owner = msg.sender;

        // Add DiamondCutFacet during deployment
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("diamondCut(address,bytes4[],bool)"));
        ds.facets[selectors[0]].facetAddress = _diamondCutFacet;
        ds.facets[selectors[0]].selectors = selectors;
    }

    fallback() external payable {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        bytes4 selector = msg.sig;
        address facet = ds.facets[selector].facetAddress;
        require(facet != address(0), "Function not found");
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), facet, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    receive() external payable {}
}
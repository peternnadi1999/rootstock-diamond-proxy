// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libraries/DiamondStorage.sol";

contract DiamondCutFacet {
    event DiamondCut(address indexed facet, bytes4[] selectors, bool added);

    function diamondCut(
        address _facet,
        bytes4[] calldata _selectors,
        bool _add
    ) external {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        require(msg.sender == ds.owner, "Only owner");

        if (_add) {
            // Map each selector to the facet address
            for (uint256 i = 0; i < _selectors.length; i++) {
                bytes4 selector = _selectors[i];
                ds.facets[selector].facetAddress = _facet;
                ds.facets[selector].selectors = _selectors; // Still store all selectors for reference
            }
        } else {
            // Remove all selectors
            for (uint256 i = 0; i < _selectors.length; i++) {
                delete ds.facets[_selectors[i]];
            }
        }
        emit DiamondCut(_facet, _selectors, _add);
    }
}
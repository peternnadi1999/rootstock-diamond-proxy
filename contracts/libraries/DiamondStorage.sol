// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library DiamondStorage {
    struct FacetAddressAndSelector {
        address facetAddress;
        bytes4[] selectors;
    }

    struct DiamondStorageStruct {
        mapping(bytes4 => FacetAddressAndSelector) facets;
        mapping(address => bool) supportedInterfaces;
        address owner;
        mapping(uint256 => string) items; // Shared marketplace state
        mapping(uint256 => uint256) prices;
    }

    function diamondStorage() internal pure returns (DiamondStorageStruct storage ds) {
        bytes32 position = keccak256("diamond.storage");
        assembly {
            ds.slot := position
        }
    }
}
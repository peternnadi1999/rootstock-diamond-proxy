// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libraries/DiamondStorage.sol";

contract MarketPlaceFacet {
    event ItemListed(uint256 itemId, string name, uint256 price);

    function listItem(uint256 itemId, string memory name, uint256 price) external {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        ds.items[itemId] = name;
        ds.prices[itemId] = price;
        emit ItemListed(itemId, name, price);
    }

    function getItem(uint256 itemId) external view returns (string memory, uint256) {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        return (ds.items[itemId], ds.prices[itemId]);
    }
}
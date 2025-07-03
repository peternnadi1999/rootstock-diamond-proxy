// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libraries/DiamondStorage.sol";

contract PaymentFacet {
    event PaymentProcessed(uint256 itemId, address buyer, uint256 amount);

    function processPayment(uint256 itemId) external payable {
        DiamondStorage.DiamondStorageStruct storage ds = DiamondStorage.diamondStorage();
        uint256 price = ds.prices[itemId];
        require(msg.value == price, "Incorrect payment amount");
        emit PaymentProcessed(itemId, msg.sender, msg.value);
    }
}
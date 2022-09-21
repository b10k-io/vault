// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// // Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    constructor() Ownable() {}

    struct Lock {
        uint256 id;
        address token;
        address owner;
        uint256 amount;
        uint unlockTime;
        string description;
    }

    Lock[] private locks;
}
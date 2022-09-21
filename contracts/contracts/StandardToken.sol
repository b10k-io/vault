// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StandardToken is ERC20 {

    event Withdrawal(uint amount, uint when);

    constructor(uint256 _totalSupply) ERC20("StandardToken", "ST") {
        _mint(msg.sender, _totalSupply);
    }

}

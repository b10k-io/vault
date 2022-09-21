// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// // Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault is Ownable, Pausable {
    using SafeERC20 for IERC20;

    constructor() Ownable() {}

    struct Lock {
        uint id;
        address token;
        address owner;
        uint256 amount;
        uint unlockTime;
    }

    Lock[] private _locks;

    // PUBLIC SETTERS

    function lock(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) external returns (uint) {
        return _createLock(_token, _owner, _amount, _unlockTime);
    }

    // PUBLIC GETTERS

    function getLockAt(uint _lockId) public view returns (Lock memory) {
        return _locks[_lockId];
    }

    function getTotalLockCount() public view returns (uint) {
        return _locks.length;
    }

    // PRIVATE SETTERS

    function _createLock(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) private returns (uint) {
        uint id = _locks.length;
        Lock memory newLock = Lock(id, _token, _owner, _amount, _unlockTime);
        _locks.push(newLock);
        return id;
    }
}
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
        uint256 amountWithdrawn;
    }

    Lock[] private _locks;
    mapping(address => uint[]) private _lockIdsByOwner;

    // EVENTS

    event Deposit(
        uint256 indexed id,
        address token,
        address owner,
        uint256 amount,
        uint256 unlockDate
    );

    event Withdraw(
        uint256 indexed id,
        address token,
        address owner,
        uint256 amount,
        uint256 unlockDate
    );

    // PUBLIC SETTERS

    function deposit(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) external returns (uint) {
        uint id = _createLock(_token, _owner, _amount, _unlockTime);
        _safeTransferFromExactAmount(_token, _owner, address(this), _amount);
        emit Deposit(id, _token, _owner, _amount, _unlockTime);
        return id;
    }

    function withdraw(uint _lockId) external {
        Lock storage lock = _locks[_lockId];
        require(msg.sender == lock.owner, "Caller is not the owner");
        require(block.timestamp >= lock.unlockTime, "Unlock time has not expired");
        require(lock.amountWithdrawn == 0, "Tokens already withdrawn");
        IERC20(lock.token).safeTransfer(msg.sender, lock.amount);
        emit Withdraw(lock.id, lock.token, lock.owner, lock.amount, lock.unlockTime);
        lock.amountWithdrawn = lock.amount;
    }

    // PUBLIC GETTERS

    function getLockAt(uint _lockId) public view returns (Lock memory) {
        return _locks[_lockId];
    }

    function getTotalLockCount() public view returns (uint) {
        return _locks.length;
    }

    function getTotalLockCountForOwner(address _owner) public view returns (uint) {
        return _lockIdsByOwner[_owner].length;
    }

    function getTotalLockIdsForOwner(address _owner) public view returns (uint[] memory) {
        return _lockIdsByOwner[_owner];
    }

    // PRIVATE SETTERS

    function _createLock(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) private returns (uint) {
        uint id = _locks.length;
        Lock memory newLock = Lock(id, _token, _owner, _amount, _unlockTime, 0);
        _locks.push(newLock);
        _lockIdsByOwner[_owner].push(id);
        return id;
    }

    function _safeTransferFromExactAmount(
        address _token,
        address _sender,
        address _receipient,
        uint256 _amount
    ) private {
        uint256 beforeBalance = IERC20(_token).balanceOf(_receipient);
        IERC20(_token).safeTransferFrom(_sender, _receipient, _amount);
        uint256 afterBalance = IERC20(_token).balanceOf(_receipient);
        require(afterBalance - beforeBalance == _amount, "Incorrect amount of tokens transferred");
    }
}
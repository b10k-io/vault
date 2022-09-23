// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// // Uncomment this line to use console.log
import "hardhat/console.sol";

import "./IVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Vault is IVault, Ownable, Pausable {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;
    using SafeMath for uint256;

    constructor() Ownable() Pausable() {}

    Lock[] private _locks;
    mapping(address => uint[]) private _lockIdsByOwner;

    EnumerableSet.AddressSet private _tokens;

    mapping(address => uint256) private _totalLockedByToken;

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
        _totalLockedByToken[lock.token] = _totalLockedByToken[lock.token].sub(lock.amount);
        emit Withdraw(lock.id, lock.token, lock.owner, lock.amount, lock.unlockTime);
        lock.amountWithdrawn = lock.amount;
    }

    // PUBLIC GETTERS

    function getLockAt(uint _lockId) external view returns (Lock memory) {
        return _locks[_lockId];
    }

    function getTotalLockCount() external view returns (uint) {
        return _locks.length;
    }

    function getTotalLockCountForOwner(address _owner) external view returns (uint) {
        return _lockIdsByOwner[_owner].length;
    }

    function getTotalLockIdsForOwner(address _owner) external view returns (uint[] memory) {
        return _lockIdsByOwner[_owner];
    }

    function getLocksBetweenIndex(uint _start, uint _end) external view returns (Lock[] memory) {
        if (_end >= _locks.length) {
            _end = _locks.length - 1;
        }
        uint length = _end - _start + 1;
        Lock[] memory locks = new Lock[](length);
        uint cur = 0;
        for (uint i = _start; i <= _end; i++) {
            locks[cur] = _locks[i];
            cur++;
        }
        return locks;
    }

    function getLockAtIndexes(uint[] memory _indexes) external view returns (Lock[] memory) {
        uint length = _indexes.length;
        Lock[] memory locks = new Lock[](length);
        uint cur = 0;
        for (uint i = 0; i < length; i++) {
            locks[cur] = _locks[i];
            cur++;
        }
        return locks;
    }

    function getTotalTokenCount() external view returns (uint) {
        return _tokens.length();
    }

    function getTokensBetween(uint _start, uint _end) external view returns (address[] memory) {
        uint total = _tokens.length();
        if (_end >= total) {
            _end = total - 1;
        }
        uint length = _end - _start + 1;
        address[] memory tokens = new address[](length);
        uint cur = 0;
        for (uint i = _start; i <= _end; i++) {
            tokens[cur] = _tokens.at(i);
            cur++;
        }
        return tokens;
    }

    function getLockedAmountByToken(address _token) external view returns (uint256) {
        return _totalLockedByToken[_token];
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
        _totalLockedByToken[_token] = _totalLockedByToken[_token].add(_amount);
        _tokens.add(_token);
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
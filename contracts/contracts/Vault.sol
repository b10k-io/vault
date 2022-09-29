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
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeMath for uint256;

    constructor() Ownable() Pausable() {}

    Lock[] private _locks;

    EnumerableSet.AddressSet private _tokens;

    mapping(address => uint256) private _totalLockedByToken;
    mapping(address => EnumerableSet.UintSet) private _lockIdsByOwner;
    mapping(address => EnumerableSet.UintSet) private _lockIdsByToken;

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
        
        _removeLock(lock);
        emit Withdraw(lock.id, lock.token, lock.owner, lock.amount, lock.unlockTime);
    }

    function extend(uint _lockId, uint _unlockTime) external {
        Lock storage lock = _locks[_lockId];
        require(msg.sender == lock.owner, "Caller is not the owner");
        require(_unlockTime > lock.unlockTime, "Can't be less than current unlockTime");
        lock.unlockTime = _unlockTime;
        emit Extend(lock.id, lock.token, lock.owner, lock.amount, lock.unlockTime);
    }

    // PUBLIC - NO ARGS

    function getTotalLockCount() external view returns (uint) {
        return _locks.length;
    }

    function getTotalTokenCount() external view returns (uint) {
        return _tokens.length();
    }

    // PUBLIC - BY LOCK ID

    function getLockById(uint _lockId) external view returns (Lock memory) {
        return _locks[_lockId];
    }

    // PUBLIC - BY TOKEN ID

    function getTokenById(uint _tokenId) external view returns (address) {
        return _tokens.at(_tokenId);
    }

    function getTokens() external view returns (uint[] memory, address[] memory) {
        uint length = _tokens.length();
        uint[] memory tokenIds = new uint[](length);
        address[] memory tokenAddrs = new address[](length);
        
        if (length > 0) {
            uint cur = 0;
            for (uint i = 0; i <= length - 1; i++) {
                tokenIds[cur] = i;
                tokenAddrs[cur] = _tokens.at(i);
                console.log(i, tokenAddrs[cur]);
                cur++;
            }
        }
        return (tokenIds, tokenAddrs);
    }

    // PUBLIC - BY OWNER

    function getLockCountByOwner(address _owner) external view returns (uint) {
        return _lockIdsByOwner[_owner].length();
    }

    function getLockIdsByOwner(address _owner) external view returns (uint[] memory) {
        EnumerableSet.UintSet storage set = _lockIdsByOwner[_owner];
        uint length = set.length();
        uint[] memory lockIds = new uint[](length);
        if (length > 0) {
            uint cur = 0;
            for (uint i = 0; i <= length - 1; i++) {
                lockIds[cur] = set.at(i);
                cur++;
            }
        }
        return lockIds;
    }

    // PUBLIC - BY TOKEN

    function getLockCountByToken(address _token) external view returns (uint) {
        return _lockIdsByToken[_token].length();
    }

    function getLockIdsByToken(address _token) external view returns (uint[] memory) {
        EnumerableSet.UintSet storage set = _lockIdsByToken[_token];
        uint length = set.length();
        uint[] memory lockIds = new uint[](length);
        if (length > 0) {
            uint cur = 0;
            for (uint i = 0; i <= length - 1; i++) {
                lockIds[cur] = set.at(i);
                cur++;
            }
        }
        return lockIds;
    }

    function getLockedAmountByToken(address _token) external view returns (uint256) {
        return _totalLockedByToken[_token];
    }

    // function getLocksBetweenIndex(uint _start, uint _end) external view returns (Lock[] memory) {
    //     if (_end >= _locks.length) {
    //         _end = _locks.length - 1;
    //     }
    //     uint length = _end - _start + 1;
    //     Lock[] memory locks = new Lock[](length);
    //     uint cur = 0;
    //     for (uint i = _start; i <= _end; i++) {
    //         locks[cur] = _locks[i];
    //         cur++;
    //     }
    //     return locks;
    // }

    // function getLockByIdIndexes(uint[] memory _indexes) external view returns (Lock[] memory) {
    //     uint length = _indexes.length;
    //     Lock[] memory locks = new Lock[](length);
    //     uint cur = 0;
    //     for (uint i = 0; i < length; i++) {
    //         locks[cur] = _locks[i];
    //         cur++;
    //     }
    //     return locks;
    // }

    // function getTokensBetween(uint _start, uint _end) external view returns (address[] memory) {
    //     uint total = _tokens.length();
    //     if (_end >= total) {
    //         _end = total - 1;
    //     }
    //     uint length = _end - _start + 1;
    //     address[] memory tokens = new address[](length);
    //     uint cur = 0;
    //     for (uint i = _start; i <= _end; i++) {
    //         tokens[cur] = _tokens.at(i);
    //         cur++;
    //     }
    //     return tokens;
    // }

    // SUPPORT 

    function canWithdraw(uint _lockId) external view returns (bool) {
        Lock memory lock = _locks[_lockId];
        bool expired = block.timestamp >= lock.unlockTime;
        bool available = lock.amountWithdrawn == 0;
        return expired && available;
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
        _lockIdsByOwner[_owner].add(id);
        _lockIdsByToken[_token].add(id);
        _totalLockedByToken[_token] = _totalLockedByToken[_token].add(_amount);
        _tokens.add(_token);

        return id;
    }

    function _removeLock(Lock storage _lock) private {
        IERC20(_lock.token).safeTransfer(msg.sender, _lock.amount);
        _lock.amountWithdrawn = _lock.amount;
        _lockIdsByOwner[_lock.owner].remove(_lock.id);
        _lockIdsByToken[_lock.token].remove(_lock.id);
        _totalLockedByToken[_lock.token] = _totalLockedByToken[_lock.token].sub(_lock.amount);


        // If there are no other locks connected to this token
        if(_lockIdsByToken[_lock.token].length() == 0) {
            // Remove the token from _tokens
            _tokens.remove(_lock.token);
        }
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
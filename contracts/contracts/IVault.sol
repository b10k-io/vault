// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IVault {

    struct Lock {
        uint id;
        address token;
        address owner;
        uint256 amount;
        uint unlockTime;
        uint256 amountWithdrawn;
    }

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

    function deposit(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) external returns (uint);

    function withdraw(uint _lockId) external;

    function getLockAt(uint _lockId) external view returns (Lock memory);

    function getTotalLockCount() external view returns (uint);

    function getTotalLockCountForOwner(address _owner) external view returns (uint);

    function getTotalLockIdsForOwner(address _owner) external view returns (uint[] memory);

    function getLocksBetweenIndex(uint _start, uint _end) external view returns (Lock[] memory);

    function getLockAtIndexes(uint[] memory _indexes) external view returns (Lock[] memory);
}
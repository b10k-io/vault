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
        uint256 unlockTime
    );

    event Withdraw(
        uint256 indexed id,
        address token,
        address owner,
        uint256 amount,
        uint256 unlockTime
    );

    event Extend(
        uint256 indexed id,
        address token,
        address owner,
        uint256 amount,
        uint256 unlockTime
    );

    function deposit(
        address _token,
        address _owner,
        uint256 _amount,
        uint _unlockTime
    ) external returns (uint);

    function withdraw(uint _lockId) external;
    
    function extend(uint _lockId, uint _unlockTime) external;

    // NO ARGS

    function getTotalLockCount() external view returns (uint);

    function getTotalTokenCount() external view returns (uint);

    // BY LOCK ID

    function getLockById(uint _lockId) external view returns (Lock memory);

    // BY TOKEN ID

    function getTokenById(uint _tokenId) external view returns (address);

    function getTokens() external view returns (uint[] memory, address[] memory);

    // BY OWNER

    function getLockCountByOwner(address _owner) external view returns (uint);

    function getLockIdsByOwner(address _owner) external view returns (uint[] memory);

    // BY TOKEN

    function getLockCountByToken(address _token) external view returns (uint);

    function getLockIdsByToken(address _token) external view returns (uint[] memory);
    
    function getLockedAmountByToken(address _token) external view returns (uint256);

    // SUPPORT

    function canWithdraw(uint _lockId) external view returns (bool);

}
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import eth from "./helpers/eth";
import { BigNumber } from "ethers";

describe("Vault", function () {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const TEN_THOUSAND_ETHER = eth(10000);

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("StandardToken")
        const token = await Token.deploy(TEN_THOUSAND_ETHER, "StandardToken", "ST")
        return token
    }

    async function deployVaultFixture() {
        const [owner, otherAccount] = await ethers.getSigners()
        const Vault = await ethers.getContractFactory("Vault")
        const vault = await Vault.deploy()
        return { vault, owner, otherAccount }
    }

    async function defaultLock() {
        const token = await deployTokenFixture();
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
        const amount = TEN_THOUSAND_ETHER;
        return { token, unlockTime, amount };
    }

    async function deployVaultWithLockFixture() {
        const { vault, owner, otherAccount } = await deployVaultFixture();
        const { token, unlockTime, amount } = await defaultLock();
        await token.approve(vault.address, amount);
        const lockId = await vault.callStatic.deposit(token.address, owner.address, amount, unlockTime)
        await vault.deposit(token.address, owner.address, amount, unlockTime)
        return { vault, owner, otherAccount, token, unlockTime, amount, lockId }
    }

    async function deployMultipleLocks(n: number) {
        const { vault, owner } = await deployVaultFixture();
        const { token, unlockTime, amount: totalAmount } = await defaultLock();
        await token.approve(vault.address, totalAmount);
        const lockedAmount = totalAmount.div(n);
        const lockIds = []
        for (let index = 0; index < n; index++) {
            const lockId = await vault.callStatic.deposit(token.address, owner.address, lockedAmount, unlockTime)
            await vault.deposit(token.address, owner.address, lockedAmount, unlockTime)
            lockIds.push(lockId)
        }
        return { vault, token, unlockTime, lockedAmount, lockIds, owner, totalAmount }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { vault, owner } = await loadFixture(deployVaultFixture);
            expect(await vault.owner()).to.equal(owner.address);
        })
    })

    describe("Lock", function () {

        describe("Deposits", function () {

            describe("Validations", function () {
                it("Should set the right token", async function () {
                    const { vault, token, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockById(lockId)
                    expect(await lock.token).to.equal(token.address);
                })

                it("Should set the right owner", async function () {
                    const { vault, owner, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockById(lockId)
                    expect(await lock.owner).to.equal(owner.address);
                });

                it("Should set the right amount", async function () {
                    const { vault, amount, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockById(lockId)
                    expect(await lock.amount).to.equal(amount);
                });

                it("Should set the right unlock time", async function () {
                    const { vault, unlockTime, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockById(lockId)
                    expect(await lock.unlockTime).to.equal(unlockTime);
                });

                it("Should add amount to token total", async function () {
                    const { vault, owner } = await deployVaultFixture()
                    const token = await deployTokenFixture()
                    const amount = eth(1000)
                    const beforeAmount = await vault.getLockedAmountByToken(token.address);
                    await token.approve(vault.address, amount)
                    await vault.deposit(token.address, owner.address, amount, ethers.constants.MaxUint256)
                    const afterAmount = await vault.getLockedAmountByToken(token.address);
                    expect(afterAmount).to.equal(beforeAmount.add(amount));
                })

                it("Should add lock to owner", async function () {
                    const { vault, owner } = await deployVaultFixture()
                    const token = await deployTokenFixture()
                    const amount = eth(1000)
                    const beforeCount: BigNumber = await vault.getLockCountByOwner(owner.address);
                    await token.approve(vault.address, amount)
                    await vault.deposit(token.address, owner.address, amount, ethers.constants.MaxUint256)
                    const afterCount: BigNumber = await vault.getLockCountByOwner(owner.address);
                    expect(afterCount).to.equal(beforeCount.add(1));
                })

                it("Should add lock to token", async function () {
                    const { vault, owner } = await deployVaultFixture()
                    const token = await deployTokenFixture()
                    const amount = eth(1000)
                    const beforeCount: BigNumber = await vault.getLockCountByToken(token.address);
                    await token.approve(vault.address, amount)
                    await vault.deposit(token.address, owner.address, amount, ethers.constants.MaxUint256)
                    const afterCount: BigNumber = await vault.getLockCountByToken(token.address);
                    expect(afterCount).to.equal(beforeCount.add(1));
                })

                it("Should add token", async function () {
                    const { vault, owner } = await deployVaultFixture()
                    const token = await deployTokenFixture()
                    const amount = eth(1000)
                    const beforeCount: BigNumber = await vault.getTotalTokenCount();
                    await token.approve(vault.address, amount)
                    await vault.deposit(token.address, owner.address, amount, ethers.constants.MaxUint256)
                    const afterCount: BigNumber = await vault.getTotalTokenCount();
                    expect(afterCount).to.equal(beforeCount.add(1));
                })
            });

            describe("Events", function () {
                it("Should emit event on creation", async function () {
                    const { vault, owner } = await deployVaultFixture();
                    const { token, unlockTime, amount } = await defaultLock();
                    await token.approve(vault.address, amount);
                    const lockId = await vault.callStatic.deposit(token.address, owner.address, amount, unlockTime)
                    await expect(vault.deposit(token.address, owner.address, amount, unlockTime))
                        .to.emit(vault, "Deposit").withArgs(
                            lockId, token.address, owner.address, amount, unlockTime
                        )
                })
            });

            describe("Transfers", function () {
                it("Should transfer amount from owner to vault", async function () {
                    const { vault, owner } = await deployVaultFixture();
                    const { token, unlockTime, amount } = await defaultLock();
                    await token.approve(vault.address, amount);

                    // NOT WORKING. SEE ISSUE: https://github.com/NomicFoundation/hardhat/issues/3097
                    // await expect(vault.deposit(token.address, owner.address, amount, unlockTime))
                    //     .to.changeTokenBalances(token, [owner, vault], [-amount, amount])

                    // BEGIN WORK AROUND
                    expect(await token.balanceOf(owner.address)).to.equal(amount)
                    expect(await token.balanceOf(vault.address)).to.equal(eth(0))
                    await vault.deposit(token.address, owner.address, amount, unlockTime)
                    expect(await token.balanceOf(owner.address)).to.equal(eth(0))
                    expect(await token.balanceOf(vault.address)).to.equal(amount)
                    // END WORK AROUND
                })
            })
        })

        describe("Access", function () {

            describe("Locks", function () {

                it("Should get total lock count", async function () {
                    const { vault } = await loadFixture(deployVaultWithLockFixture)
                    expect(await vault.getTotalLockCount()).to.equal(1)
                })

                it("Should get lock by id", async function () {
                    const { vault, lockId, token, owner, amount, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockById(lockId)
                    expect(lock.id).to.equal(lockId)
                    expect(lock.token).to.equal(token.address)
                    expect(lock.owner).to.equal(owner.address)
                    expect(lock.amount).to.equal(amount)
                    expect(lock.unlockTime).to.equal(unlockTime)
                })

                it("Should get total lock count for owner", async function () {
                    const { vault, owner, otherAccount } = await loadFixture(deployVaultWithLockFixture);
                    expect(await vault.getLockCountByOwner(owner.address)).to.equal(1);
                    expect(await vault.getLockCountByOwner(otherAccount.address)).to.equal(0);
                })

                it("Should get lock ids for owner", async function () {
                    const { vault, owner, otherAccount } = await loadFixture(deployVaultWithLockFixture);
                    expect(await vault.getLockIdsByOwner(owner.address)).to.eql([eth(0)]);
                    expect(await vault.getLockIdsByOwner(otherAccount.address)).to.eql([]);
                })

                it("Should return false on canWithdraw", async function () {
                    const { vault, lockId } = await loadFixture(deployVaultWithLockFixture)
                    expect(await vault.canWithdraw(lockId)).to.be.false
                })

                it("Should return true on canWithdraw", async function () {
                    const { vault, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);
                    expect(await vault.canWithdraw(lockId)).to.be.true
                })

            })

            describe("Tokens", function () {

                it("Should get total tokens count", async function () {
                    const { vault } = await loadFixture(deployVaultWithLockFixture)
                    expect(await vault.getTotalTokenCount()).to.equal(1)
                })

                // it("Should get tokens locked between", async function () {
                //     const { vault, token } = await loadFixture(deployVaultWithLockFixture)
                //     expect(await vault.getTokensBetween(0, 1)).to.include(token.address)
                // })

                it("Should get total locked by token", async function () {
                    const { vault, token, totalAmount } = await deployMultipleLocks(5);
                    expect(await vault.getLockedAmountByToken(token.address)).to.equal(totalAmount)
                })

                it("Should get lock indexes by token", async function() {
                    const { vault, lockIds, token, unlockTime, lockedAmount, owner } = await deployMultipleLocks(5);
                    const result: BigNumber[] = await vault.getLockIdsByToken(token.address);
                    for (let i = 0; i < lockIds.length; i++) {
                        const lockId = lockIds[i];
                        expect(lockId.eq(result[i]))
                    }
                })

                it("Should get token by id", async function () {
                    const { vault, token } = await loadFixture(deployVaultWithLockFixture)
                    expect(await vault.getTokenById(0)).to.equal(token.address)
                })

            })
        })

        describe("Withdrawls", function () {

            describe("Validations", function () {

                it("Should revert with the right error if called too soon", async function () {
                    const { vault, lockId } = await loadFixture(deployVaultWithLockFixture)
                    await expect(vault.withdraw(lockId)).to.be.revertedWith(
                        "Unlock time has not expired"
                    );
                })

                it("Should revert with the right error if called from another account", async function () {
                    const { vault, lockId, unlockTime, otherAccount } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);
                    await expect(vault.connect(otherAccount).withdraw(lockId)).to.be.revertedWith(
                        "Caller is not the owner"
                    );
                })

                it("Should revert with the right error if the tokens are already withdrawn", async function () {
                    const { vault, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);
                    await vault.withdraw(lockId)
                    await expect(vault.withdraw(lockId)).to.be.revertedWith(
                        "Tokens already withdrawn"
                    );
                })

                it("Shouldn't fail if the unlock time has expired and the owner calls it", async function () {
                    const { vault, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);
                    await expect(vault.withdraw(lockId)).not.to.be.reverted
                })

                it("Should remove amount from token total", async function () {
                    const { vault, token, lockId, unlockTime, amount } = await loadFixture(deployVaultWithLockFixture)
                    const beforeAmount = await vault.getLockedAmountByToken(token.address);
                    await time.increaseTo(unlockTime);
                    await vault.withdraw(lockId);
                    expect(await vault.getLockedAmountByToken(token.address)).to.equal(beforeAmount.sub(amount));
                })

                it("Should remove lock from owner", async function () {
                    const { vault, owner, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    const beforeCount: BigNumber = await vault.getLockCountByOwner(owner.address);
                    await time.increaseTo(unlockTime);
                    await vault.withdraw(lockId);
                    const afterCount: BigNumber = await vault.getLockCountByOwner(owner.address);
                    expect(afterCount).to.equal(beforeCount.sub(1));
                })

                it("Should remove lock from token", async function () {
                    const { vault, token, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    const beforeCount: BigNumber = await vault.getLockCountByToken(token.address);
                    await time.increaseTo(unlockTime);
                    await vault.withdraw(lockId);
                    const afterCount: BigNumber = await vault.getLockCountByToken(token.address);
                    expect(afterCount).to.equal(beforeCount.sub(1));
                })

                it("Should remove token", async function () {
                    const { vault, token, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    const beforeCount: BigNumber = await vault.getTotalTokenCount()
                    await time.increaseTo(unlockTime);
                    await vault.withdraw(lockId);
                    const afterCount: BigNumber = await vault.getTotalTokenCount()
                    expect(afterCount).to.equal(beforeCount.sub(1));
                })

            })

            describe("Events", function () {
                it("Should emit an event on withdrawals", async function () {
                    const { vault, token, owner, amount, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);
                    await expect(vault.withdraw(lockId))
                        .to.emit(vault, "Withdraw").withArgs(
                            lockId, token.address, owner.address, amount, unlockTime
                        )
                });
            });

            describe("Transfers", function () {
                it("Should transfer amount from vault to owner", async function () {
                    const { vault, token, owner, amount, lockId, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                    await time.increaseTo(unlockTime);

                    // NOT WORKING. SEE ISSUE: https://github.com/NomicFoundation/hardhat/issues/3097
                    // await expect(vault.withdraw(lockId))
                    //     .to.changeTokenBalances(token, [owner, vault], [amount, -amount])

                    // BEGIN WORK AROUND
                    expect(await token.balanceOf(owner.address)).to.equal(eth(0))
                    expect(await token.balanceOf(vault.address)).to.equal(amount)
                    await vault.withdraw(lockId)
                    expect(await token.balanceOf(owner.address)).to.equal(amount)
                    expect(await token.balanceOf(vault.address)).to.equal(eth(0))
                    // END WORK AROUND
                })
            })

        })
    })

})
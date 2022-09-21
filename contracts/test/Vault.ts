import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import eth from "./helpers/eth";

describe("Vault", function () {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const TEN_THOUSAND_ETHER = eth(10000);

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("StandardToken")
        const token = await Token.deploy(TEN_THOUSAND_ETHER)
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

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { vault, owner } = await loadFixture(deployVaultFixture);
            expect(await vault.owner()).to.equal(owner.address);
        })
    })

    describe("Lock", function () {

        describe("Creation", function () {

            describe("Validations", function () {
                it("Should set the right token", async function () {
                    const { vault, token, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockAt(lockId)
                    expect(await lock.token).to.equal(token.address);
                })

                it("Should set the right owner", async function () {
                    const { vault, owner, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockAt(lockId)
                    expect(await lock.owner).to.equal(owner.address);
                });

                it("Should set the right amount", async function () {
                    const { vault, amount, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockAt(lockId)
                    expect(await lock.amount).to.equal(amount);
                });

                it("Should set the right unlock time", async function () {
                    const { vault, unlockTime, lockId } = await loadFixture(deployVaultWithLockFixture)
                    const lock = await vault.getLockAt(lockId)
                    expect(await lock.unlockTime).to.equal(unlockTime);
                });
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
            it("Should get total lock count", async function () {
                const { vault } = await loadFixture(deployVaultWithLockFixture)
                expect(await vault.getTotalLockCount()).to.equal(1)
            })

            it("Should get lock at index", async function () {
                const { vault, lockId, token, owner, amount, unlockTime } = await loadFixture(deployVaultWithLockFixture)
                const lock = await vault.getLockAt(lockId)
                expect(lock.id).to.equal(lockId)
                expect(lock.token).to.equal(token.address)
                expect(lock.owner).to.equal(owner.address)
                expect(lock.amount).to.equal(amount)
                expect(lock.unlockTime).to.equal(unlockTime)
            })

            it("Should get total lock count for owner", async function () {
                const { vault, owner, otherAccount } = await loadFixture(deployVaultWithLockFixture);
                expect(await vault.getTotalLockCountForOwner(owner.address)).to.equal(1);
                expect(await vault.getTotalLockCountForOwner(otherAccount.address)).to.equal(0);
            })

            it("Should get lock ids for owner", async function () {
                const { vault, owner, otherAccount } = await loadFixture(deployVaultWithLockFixture);
                expect(await vault.getTotalLockIdsForOwner(owner.address)).to.eql([eth(0)]);
                expect(await vault.getTotalLockIdsForOwner(otherAccount.address)).to.eql([]);
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
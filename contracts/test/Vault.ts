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
        const token = await loadFixture(deployTokenFixture);
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
        const amount = TEN_THOUSAND_ETHER;
        return { token, unlockTime, amount };
    }

    async function deployVaultWithLockFixture() {
        const { vault, owner, otherAccount } = await loadFixture(deployVaultFixture);
        const { token , unlockTime, amount } = await defaultLock();
        await token.approve(vault.address, amount);
        const lockId = await vault.callStatic.lock(token.address, owner.address, amount, unlockTime)
        await vault.lock(token.address, owner.address, amount, unlockTime)
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
        })
    })
})
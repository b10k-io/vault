import { ethernal, ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

ethernal.resetWorkspace("Vault")

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

async function deployContract(name: string, ...args: any) {
    const Contract = await ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed()

    await ethernal.push({
        name,
        address: contract.address
    })
    console.log(`${name} deployed to ${contract.address}`);
    return contract;
}

async function createLock(vault: Contract, token: Contract, owner: SignerWithAddress, amount: BigNumber) {
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    await token.approve(vault.address, amount);
    await vault.deposit(token.address, owner.address, amount, unlockTime)
}

async function main() {

    const vault = await deployContract("Vault")
    const [owner] = await ethers.getSigners()

    const n = 12;
    for (let i = 0; i < n; i++) {
        const token = await deployContract("StandardToken", ethers.utils.parseEther("10000"), `Token ${i}`, `ST${i}`),
        const amount = (await token.totalSupply()).div(n)
        for (let j = 0; j < n; j++) {
            await createLock(vault, token, owner, amount)
        }
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

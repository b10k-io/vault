import { ethernal, ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { faker } from '@faker-js/faker';

ethernal.resetWorkspace("Vault")

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
const ONE_YEAR_IN_MINS = 365 * 24 * 60;

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

async function createLock(vault: Contract, token: Contract, wallet: SignerWithAddress, unlockTime: number, amount: BigNumber) {
    unlockTime = (await time.latest()) + unlockTime;
    await token.connect(wallet).approve(vault.address, amount);
    await vault.deposit(token.address, wallet.address, amount, unlockTime)
}

function getRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

async function randomLock(vault: Contract, token: Contract, owner: SignerWithAddress, wallet: SignerWithAddress, unlockTime: number, amount: BigNumber) {
    await token.transfer(wallet.address, amount)
    await createLock(vault, token, wallet, unlockTime, amount)
}

async function main() {

    const vault = await deployContract("Vault")
    const signers = await ethers.getSigners()
    const [owner] = signers

    const n = 15;
    for (let i = 0; i < n; i++) {
        const { name, symbol, atomicNumber} = faker.science.chemicalElement()
        // console.log(name, symbol, atomicNumber)
        const totalSupply = atomicNumber * 100
        const token = await deployContract("StandardToken", ethers.utils.parseEther(totalSupply.toString()), name, symbol.toUpperCase())

        const m = getRandomNumberBetween(1, signers.length - 1)
        for (let j = 0; j < m; j++) {
            const wallet = signers[j]
            const amountNb = getRandomNumberBetween(1, 5) * totalSupply / 100
            const amountBn = ethers.utils.parseEther(amountNb.toString())
            const unlockTime = getRandomNumberBetween(1, 60) * ONE_YEAR_IN_MINS
            randomLock(vault, token, owner, wallet, unlockTime, amountBn)
        }
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

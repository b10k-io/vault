import { ethernal, ethers } from "hardhat";

ethernal.resetWorkspace("Vault")

async function main() {
  
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy();

  await vault.deployed();
  await ethernal.push({
    name: "Vault",
    address: vault.address
  })

  console.log(`Vault deployed to ${vault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

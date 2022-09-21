import { ethernal, ethers } from "hardhat";

async function main() {
  
  const Token = await ethers.getContractFactory("StandardToken");
  const token = await Token.deploy(ethers.utils.parseEther("10000"));

  await token.deployed();
  await ethernal.push({
    name: "StandardToken",
    address: token.address
  })

  console.log(`Token deployed to ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

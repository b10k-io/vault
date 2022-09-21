import { ethernal, ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

async function main() {
    const value = ethers.utils.parseEther("1000")
    const to = process.env.WALLET
    const [signer] = await ethers.getSigners()
    await signer.sendTransaction({ to, value })

  console.log(`Sent ${ethers.utils.formatEther(value)} to ${to}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

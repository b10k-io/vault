import { BigNumber } from "ethers"
import { ethers } from "hardhat"

async function deployToken(totalSupply: BigNumber) {
  const Token = await ethers.getContractFactory("StandardToken")
  const token = await Token.deploy(totalSupply)
  await token.deployed()
  return token
}

export default deployToken
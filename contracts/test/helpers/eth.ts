import { ethers } from "hardhat"

function eth(n: number) {
    return ethers.utils.parseEther(n.toString())
}

export default eth
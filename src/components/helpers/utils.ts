import { BigNumber, ethers } from "ethers";

export function parseEther(n: number): BigNumber {
    return ethers.utils.parseEther(n.toString());
}

export function formatEther(bn: BigNumber): string {
    return ethers.utils.formatEther(bn);
}
import { BigNumber, ethers } from "ethers";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })

export function parseEther(bn: number): BigNumber {
    return ethers.utils.parseEther(bn.toString());
}

export function formatEther(bn: BigNumber): string {
    return ethers.utils.formatEther(bn);
}

export function formatTimestamp(bn: BigNumber): string {
    const n = bn.toNumber()
    const d = new Date(n)
    return dateFormatter.format(d)
}

export function formatCommify(bn: BigNumber, dp: number = 4): string {
    return ethers.utils.commify((+formatEther(bn)).toFixed(dp))
}
import { BigNumber } from "ethers";

export interface ILock {
    id: BigNumber
    token: string
    owner: string
    amount: BigNumber
    unlockTime: BigNumber
    amountWithdrawn: BigNumber
}
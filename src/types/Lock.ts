import { BigNumber } from "ethers";

export interface Lock {
    id: BigNumber
    token: string
    owner: string
    amount: BigNumber
    unlockTime: BigNumber
    amountWithdrawn: BigNumber
}
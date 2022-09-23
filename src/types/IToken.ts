import { BigNumber } from "ethers"

export interface IToken {
    address: string | undefined
    name: string | undefined
    symbol: string | undefined
    lockedAmount: BigNumber | undefined
}
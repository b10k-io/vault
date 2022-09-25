// import { useCall, useCalls } from "@usedapp/core"
// import { BigNumber, Contract } from "ethers"
// import IVault from "../interfaces/IVault.json";
// import IERC20Metadata from "../interfaces/IERC20Metadata.json";
import { IToken } from "../types/IToken";
import { useNames, useSymbols } from "./ERC20Metadata";
import useRange from "./useRange";
import { useLockedAmounts, useTokensByIds } from "./Vault";

function useTable(address: string, startIndex: number, endIndex: number): IToken[] | undefined {
    const range = useRange(startIndex, endIndex)
    const tokens = useTokensByIds(address, range)
    const names = useNames(tokens)
    const symbols = useSymbols(tokens)
    const lockedAmounts = useLockedAmounts(address, tokens)

    let arr: IToken[] = new Array(tokens.length)
    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        const name = names[index];
        const symbol = symbols[index];
        const lockedAmount = lockedAmounts[index];
        arr[index] = { address: token, name, symbol, lockedAmount }
    }
    return arr
}

export default useTable
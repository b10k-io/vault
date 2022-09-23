import { BigNumber } from "ethers"
import config from "../../config"
import { useGetTokensBetween, useGetLockedAmountByTokens } from "../../hooks/Vault"
import TableRow from "./TableRow"
import { Lock } from "../../types/Lock"
import { useNames, useSymbols } from "../../hooks/ERC20Metadata"
import { useEffect, useState } from "react"
import { ITable } from "../../types/ITable"
import { IToken } from "../../types/IToken"

const Table = ({ start = 0, end = 10 }: ITable) => {

    const tokens = useGetTokensBetween(config.hardhat.vault, start, end)
    const names = useNames(tokens)
    const symbols = useSymbols(tokens)
    const lockedAmounts = useGetLockedAmountByTokens(config.hardhat.vault, tokens)
    const [data, setData] = useState<IToken[]>([])

    useEffect(() => {
        if (tokens) {
            const length = tokens?.length
            let arr: IToken[] = new Array(length)
            for (let index = 0; index < tokens.length; index++) {
                const token = tokens[index];
                const name = names[index];
                const symbol = symbols[index];
                const lockedAmount = lockedAmounts[index];
                arr[index] = { address: token, name, symbol, lockedAmount }
            }
            setData(arr)
        }
    }, [tokens])

    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <td className="text-sm uppercase text-slate-400 font-semibold">Asset</td>
                    <td className="text-sm uppercase text-slate-400 font-semibold text-right">Total Amount Locked</td>
                    <td className="text-sm uppercase text-slate-400 font-semibold text-right"></td>
                </tr>
            </thead>
            <tbody>
                {data?.map((token, key) => <TableRow key={key} token={token} />)}
            </tbody>
        </table>
    )
}

export default Table
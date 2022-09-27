import config from "../../config"
import TableRow from "./TableRow"
import { ITable } from "../../types/ITable"
import { IToken } from "../../types/IToken"
import useTable from "../../hooks/useTable"

const Table = ({ startIndex = 0, endIndex = 0 }: ITable) => {

    const tokens: IToken[] | undefined = useTable(config.hardhat.vault, startIndex, endIndex)

    return (
        <>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <td className="text-sm uppercase text-slate-400 font-semibold">Asset</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right">Total Amount Locked</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right"></td>
                    </tr>
                </thead>
                <tbody>
                    {tokens?.map((token, key) => <TableRow key={key} token={token} />)}
                </tbody>
            </table>
        </>
    )
}

export default Table
import { BigNumber } from "ethers"
import config from "../../config"
import { useGetLocksBetweenIndex } from "../../hooks/Vault"
import TableRow from "./TableRow"
import { Lock } from "../../types/Lock"

interface ITable {
    start: BigNumber | number | undefined
    end: BigNumber | number | undefined
}

const Table = ({ start = 0, end = 10 }: ITable) => {

    const locks: Lock[] | undefined = useGetLocksBetweenIndex(config.hardhat.vault, start, end)

    return (
        <table className="table-auto w-full mt-8">
            <thead>
                <tr>
                    <td className="text-sm uppercase text-slate-400 font-semibold ">Asset</td>
                    <td className="text-sm uppercase text-slate-400 font-semibold text-right">Amount</td>
                    <td className="text-sm uppercase text-slate-400 font-semibold text-right">Expires</td>
                </tr>
            </thead>
            <tbody>
                {locks?.map((lock, key) => <TableRow key={key} lock={lock} />)}
            </tbody>
        </table>
    )
}

export default Table
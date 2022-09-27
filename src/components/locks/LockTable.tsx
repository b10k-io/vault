import config from "../../config"
import { useLockTable } from "../../hooks/useLockTable"
import { ILock } from "../../types/ILock"
import LockRow from "./LockRow"

interface ILockTable {
    tokenAddress: string
}

const LockTable = ({ tokenAddress }: ILockTable) => {
    const locks: ILock[] | undefined = useLockTable(config.hardhat.vault, tokenAddress)

    return(
        <>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <td className="text-sm uppercase text-slate-400 font-semibold">Owner</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right">Amount</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right">Unlock Time</td>
                    </tr>
                </thead>
                <tbody>
                    {locks?.map((lock: ILock, key) => <LockRow key={key} lock={lock} />)}
                </tbody>
            </table>
        </>
    )
}

export default LockTable
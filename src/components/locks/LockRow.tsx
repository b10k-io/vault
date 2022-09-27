import TableCell from "../table/TableCell"
import { formatCommify, formatTimestamp } from "../helpers/utils";
import { ILock } from "../../types/ILock";
import { ChainId, shortenIfAddress, useChainMeta, useEthers } from "@usedapp/core";

interface ILockRow {
    lock: ILock
}

const LockRow = ({ lock }: ILockRow) => {

    const { chainId } = useEthers()
    const meta = useChainMeta(chainId as ChainId)

    return (
        <>
            <tr className="group">
                <TableCell>
                    <a href={meta.getExplorerAddressLink(lock.owner)} className="hover:underline" target="_blank">{shortenIfAddress(lock.owner)}</a>
                </TableCell>
                <TableCell klass="text-right">
                    <div>{formatCommify(lock.amount)}</div>
                </TableCell>
                <TableCell klass="text-right">
                    <div>{formatTimestamp(lock.unlockTime.mul(1000))}</div>
                </TableCell>
            </tr>
        </>
    )
}

export default LockRow
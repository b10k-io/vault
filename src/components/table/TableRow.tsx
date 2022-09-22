import TableCell from "./TableCell"
import { Lock } from "../../types/Lock"
import { useName } from "../../hooks/ERC20Metadata";
import { formatEther, formatTimestamp } from "../helpers/utils";

interface ITableRow {
    lock: Lock
}

const TableRow = ({ lock }: ITableRow) => {

    const token = {
        name: useName(lock.token)
    }


    return (
        <tr className="group">
            <TableCell klass="group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>{token.name}</div>
            </TableCell>
            <TableCell klass="text-right group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>{formatEther(lock.amount)}</div>
            </TableCell>
            <TableCell klass="text-right group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>{formatTimestamp(lock.unlockTime.mul(1000))}</div>
            </TableCell>
        </tr>
    )
}

export default TableRow
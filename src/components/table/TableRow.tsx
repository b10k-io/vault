import TableCell from "./TableCell"
import { formatCommify } from "../helpers/utils";
import { IToken } from "../../types/IToken";
import { Link } from "react-router-dom";

interface ITableRow {
    token: IToken
}

const TableRow = ({ token }: ITableRow) => {

    const to = `/tokens/${token.address}`

    return (
        <tr className="group">
            <TableCell>
                <div className="flex flex-col">
                    <div>{token.name}</div>
                    <div>{token.symbol}</div>
                </div>
            </TableCell>
            <TableCell klass="text-right">
                <div>{token.lockedAmount ? formatCommify(token.lockedAmount) : <></>}</div>
            </TableCell>
            <TableCell klass="text-right">
                <Link to={to} className="hover:underline">View</Link>
            </TableCell>
        </tr>
    )
}

export default TableRow
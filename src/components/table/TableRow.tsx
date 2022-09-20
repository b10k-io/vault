import TableCell from "./TableCell"

const TableRow = () => {
    return (
        <tr className="group">
            <TableCell klass="group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>GOD / WBNB</div>
            </TableCell>
            <TableCell klass="text-right group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>1,000</div>
            </TableCell>
            <TableCell klass="text-right group-hover:bg-white group-hover:text-black" to="/vaults/1234">
                <div>1m 3w 2d 6h 3m</div>
            </TableCell>
        </tr>
    )
}

export default TableRow
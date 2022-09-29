import { Fragment } from "react"

interface ITableRow {
    row: JSX.Element[]
}

const TableRow = ({ row }: ITableRow) => {
    return (
        <tr className="group">
            {row.map((cell, key) => <Fragment key={key}>{cell}</Fragment>)}
        </tr>
    )
}

export default TableRow
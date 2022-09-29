import { ITable } from "../../constants/types/Table"
import { klass } from "./tableHelper"
import TableRow from "./TableRow"

const HEADER_CLASS = "text-sm uppercase text-slate-400 font-semibold"

const Table = ({ headers = [], rows = [] }: ITable) => {
    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    {headers.map((header, key) => <td key={key} className={klass(header, HEADER_CLASS)}>{header.value}</td>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, key) => <TableRow key={key} row={row} />)}
            </tbody>
        </table>
    )
}

export default Table
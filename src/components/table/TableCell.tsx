import { Link } from "react-router-dom"

interface ITableCell {
    klass: string
    to: string
    children: JSX.Element
}

const TableCell = ({ klass, to, children }: ITableCell) => {
    return (
        <td className={klass}>
            <Link to={to}>
                <div className="py-4">
                    {children}
                </div>
            </Link>
        </td>
    )
}

export default TableCell
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

const Index = () => {
    return (
        <div>
            <h1 className="text-xl font-semibold uppercase text-center">Vaults</h1>
            <table className="table-auto w-full mt-8">
                <thead>
                    <tr>
                        <td className="text-sm uppercase text-slate-400 font-semibold ">Asset</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right">Amount</td>
                        <td className="text-sm uppercase text-slate-400 font-semibold text-right">Expiry</td>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5].map((o, i) => <TableRow key={i} />)}
                </tbody>
            </table>

        </div>
    )
}

export default Index
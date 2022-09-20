import TableRow from "./TableRow"

const Table = () => {
    return (
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
    )
}

export default Table
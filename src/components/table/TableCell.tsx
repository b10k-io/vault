interface ITableCell {
    klass?: string
    children: JSX.Element
}

const TableCell = ({ klass = "", children }: ITableCell) => {
    return (
        <td className={["group-hover:bg-white/20 py-4", klass].join(" ")}>
            {children}
        </td>
    )
}

export default TableCell
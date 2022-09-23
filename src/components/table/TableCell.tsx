interface ITableCell {
    klass?: string
    children: JSX.Element
}

const TableCell = ({ klass = "", children }: ITableCell) => {
    return (
        <td className={["text-white/60 group-hover:text-white py-4", klass].join(" ")}>
            {children}
        </td>
    )
}

export default TableCell
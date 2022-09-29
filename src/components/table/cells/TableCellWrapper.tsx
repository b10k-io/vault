interface ITableCellWrapper {
    className?: string
    children: JSX.Element | JSX.Element[] | string
}

function TableCellWrapper ({ className = "", children }: ITableCellWrapper) {
    return (
        <td className={["text-white/60 group-hover:text-white py-4", className].join(" ")}>{children}</td>
    )
}

export default TableCellWrapper
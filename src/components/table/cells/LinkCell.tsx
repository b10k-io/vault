import { Link } from "react-router-dom"
import TableCellWrapper from "./TableCellWrapper"

interface ILinkCell {
    to: string
    text?: string
    target?: "" | "_blank"
    className?: string
    external?: boolean
}

function LinkCell({ to, target = "", text = "View", className = "", external = false }: ILinkCell) {
    return (
        <TableCellWrapper className={className}>
            { external ? <a href={to} target={target} className="hover:underline">{text}</a> : <Link to={to} target={target} className="hover:underline">{text}</Link> }
        </TableCellWrapper>
    )
}

export default LinkCell
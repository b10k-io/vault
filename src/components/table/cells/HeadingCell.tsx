import TableCellWrapper from "./TableCellWrapper"

interface IHeadingCell {
    heading?: string
    subheading?: string
}

function HeadingCell({ heading, subheading }: IHeadingCell) {
    return (
        <TableCellWrapper>
            <div>{heading}</div>
            <div className="text-sm">{subheading}</div>
        </TableCellWrapper>
    )
}

export default HeadingCell
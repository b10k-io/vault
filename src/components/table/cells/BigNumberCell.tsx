import { BigNumber } from "ethers"
import { formatCommify } from "../../helpers/utils"
import TableCellWrapper from "./TableCellWrapper"

interface IBigNumberCell {
    bn?: BigNumber
}

function BigNumberCell({ bn = BigNumber.from(0) }: IBigNumberCell) {
    return (<TableCellWrapper className="text-right">{formatCommify(bn)}</TableCellWrapper>)
}

export default BigNumberCell
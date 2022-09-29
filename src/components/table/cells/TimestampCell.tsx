import { BigNumber } from "ethers"
import { formatTimestamp } from "../../helpers/utils"
import TableCellWrapper from "./TableCellWrapper"

interface ITimestampCell {
    timestamp?: BigNumber
}

function TimestampCell({ timestamp = BigNumber.from(0) }: ITimestampCell) {
    return (<TableCellWrapper className="text-right">{formatTimestamp(timestamp.mul(1000))}</TableCellWrapper>)
}

export default TimestampCell
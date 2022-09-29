import { BigNumber } from "ethers"
import BigNumberCell from "../components/table/cells/BigNumberCell"
import HeadingCell from "../components/table/cells/HeadingCell"
import LinkCell from "../components/table/cells/LinkCell"
import { ITable } from "../constants/types/Table"
import { useNames } from "./tokens/useNames"
import { useSymbols } from "./tokens/useSymbols"
import { useGetLockedAmountByTokens } from "./vault/useGetLockedAmountByTokens"
import { useGetTokensByIds } from "./vault/useGetTokensByIds"

const useTokensTable = (tokenIds: BigNumber[]): ITable => {
    const table: ITable = {
        headers: [
            { value: "Asset" },
            { value: "Amount Locked", textRight: true },
            { value: "", textRight: true },
        ],
        rows: []
    }
    const tokenAddresses = useGetTokensByIds(tokenIds)
    const names = useNames(tokenAddresses)
    const symbols = useSymbols(tokenAddresses)
    const lockedAmounts = useGetLockedAmountByTokens(tokenAddresses)

    for (let index = 0; index < tokenIds.length; index++) {
        const address = tokenAddresses[index];
        const name = names[index];
        const symbol = symbols[index];
        const lockedAmount = lockedAmounts[index];
        table.rows.push([
            <HeadingCell heading={name} subheading={symbol} />,
            <BigNumberCell bn={lockedAmount} />,
            <LinkCell to={address} className="text-right" />
        ])
    }

    return table
}

export default useTokensTable
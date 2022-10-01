import { useEthers, useChainMeta, ChainId } from "@usedapp/core"
import { BigNumber } from "ethers"
import ExtendButton from "../components/buttons/ExtendButton"
import WithdrawButton from "../components/buttons/WithdrawButton"
import BigNumberCell from "../components/table/cells/BigNumberCell"
import LinkCell from "../components/table/cells/LinkCell"
import TableCellWrapper from "../components/table/cells/TableCellWrapper"
import TimestampCell from "../components/table/cells/TimestampCell"
import { ITable } from "../constants/types/Table"
import { useNames } from "./tokens/useNames"
import { useCanWithdraws } from "./vault/useCanWithdraws"
import { useGetLocksByIds } from "./vault/useGetLocksByIds"
import { useIsWithdrawns } from "./vault/useIsWithdrawns"

export function usePrivateLockTable(lockIds: BigNumber[] | undefined): ITable {
    const table: ITable = {
        headers: [
            { value: "Token" },
            { value: "Amount Locked", textRight: true },
            { value: "Amount Withdrawn", textRight: true },
            { value: "Unlock Time", textRight: true },
            { value: "", textRight: true },
        ],
        rows: []
    }

    const { chainId } = useEthers()
    const chainMeta = useChainMeta(chainId as ChainId)

    const locks = useGetLocksByIds(lockIds)
    const canWithdraws = useCanWithdraws(lockIds)
    const isWithdrawns = useIsWithdrawns(lockIds)
    const tokenAddresses = locks.map(lock => lock.token)
    const tokenNames = useNames(tokenAddresses)

    for (let index = 0; index < locks.length; index++) {
        const lock = locks[index];
        const name = tokenNames[index];
        const canWithdraw = canWithdraws[index]
        const isWithdrawn = isWithdrawns[index]
        table.rows.push([
            <LinkCell to={chainMeta.getExplorerAddressLink(lock.token)} text={name} target="_blank" external/>,
            <BigNumberCell bn={lock.amount} />,
            <BigNumberCell bn={lock.amountWithdrawn} />,
            <TimestampCell timestamp={lock.unlockTime} />,
            <TableCellWrapper>
                <div className="flex gap-2 justify-end text-sm">
                <WithdrawButton lockId={lock.id} canWithdraw={canWithdraw} isWithdrawn={isWithdrawn} />
                <ExtendButton lock={lock} isWithdrawn={isWithdrawn} />
                </div>
            </TableCellWrapper>
        ])
    }


    return table
}
import { useEthers, useChainMeta, ChainId, shortenIfAddress } from "@usedapp/core"
import { BigNumber } from "ethers"
import BigNumberCell from "../components/table/cells/BigNumberCell"
import LinkCell from "../components/table/cells/LinkCell"
import TableCellWrapper from "../components/table/cells/TableCellWrapper"
import TimestampCell from "../components/table/cells/TimestampCell"
import { ITable } from "../constants/types/Table"
import { useNames } from "./tokens/useNames"
import { useCanWithdraws } from "./vault/useCanWithdraws"
import { useGetLocksByIds } from "./vault/useGetLocksByIds"
import { useIsWithdrawns } from "./vault/useIsWithdrawns"

function handleClick(lockId: BigNumber) {
    console.log("Withdrawing from lockId:", lockId)
}

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
                { !isWithdrawn && canWithdraw ? <button onClick={() => handleClick(lock.id)} className="border border-orange-300 py-1 px-2 text-orange-300 hover:underline">Withdraw</button> : <></> }
                { !isWithdrawn ? <button onClick={() => handleClick(lock.id)} className="border border-blue-400 py-1 px-2 text-blue-400 hover:underline">Extend</button> : <></> }
                </div>
            </TableCellWrapper>
        ])
    }


    return table
}
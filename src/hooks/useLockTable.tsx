import { useEthers, useChainMeta, ChainId, shortenIfAddress } from "@usedapp/core"
import BigNumberCell from "../components/table/cells/BigNumberCell"
import LinkCell from "../components/table/cells/LinkCell"
import TimestampCell from "../components/table/cells/TimestampCell"
import { ITable } from "../constants/types/Table"
import { useGetLockIdsByToken } from "./vault/useGetLockIdsByToken"
import { useGetLocksByIds } from "./vault/useGetLocksByIds"

export function useLockTable(tokenAddress: string): ITable {
    const table: ITable = {
        headers: [
            { value: "Owner" },
            { value: "Amount Locked", textRight: true },
            { value: "Unlock Time", textRight: true },
        ],
        rows: []
    }

    const { chainId } = useEthers()
    const chainMeta = useChainMeta(chainId as ChainId)

    const lockIds = useGetLockIdsByToken(tokenAddress)
    const locks = useGetLocksByIds(lockIds)

    for (let index = 0; index < locks.length; index++) {
        const lock = locks[index];
        table.rows.push([
            <LinkCell to={chainMeta.getExplorerAddressLink(lock.owner)} text={shortenIfAddress(lock.owner)} target="_blank" external/>,
            <BigNumberCell bn={lock.amount} />,
            <TimestampCell timestamp={lock.unlockTime} />
        ])
    }


    return table
}
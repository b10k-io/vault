import { useEthers } from "@usedapp/core"
import { useState } from "react"
import { usePrivateLockTable } from "../../../hooks/usePrivateLockTable"
import { useGetLockCountByOwner } from "../../../hooks/vault/useGetLockCountByOwner"
import { useGetLockIdsByOwner } from "../../../hooks/vault/useGetLockIdsByOwner"
import Pagination from "../../pagination/Pagination"
import Table from "../../table/Table"

function AccountLocks() {

    const [startIndex, setStartIndex] = useState<number>(0)
    const [endIndex, setEndIndex] = useState<number>(10)

    const { account } = useEthers()
    const lockCount = useGetLockCountByOwner(account)
    
    const lockIds = useGetLockIdsByOwner(account)

    const { headers, rows } = usePrivateLockTable(lockIds?.slice(startIndex, endIndex))

    function handleIndexChange(startIndex: number, endIndex: number) {
        if (startIndex >= 0 && endIndex >= 0) {
            setStartIndex(startIndex)
            setEndIndex(endIndex)
        }
    }

    return (
        <>
            <h1 className="text-xl font-semibold uppercase text-center">
                <span>{lockCount ? <>{lockCount.toString()}</> : <></>} Locks</span>
            </h1>
            <Pagination handleIndexChange={handleIndexChange} totalItems={lockCount ? lockCount.toNumber() : 0} />
            <div className="border p-4 bg-white/10 mt-8">
                <Table headers={headers} rows={rows} />
            </div>
        </>
    )
}

export default AccountLocks
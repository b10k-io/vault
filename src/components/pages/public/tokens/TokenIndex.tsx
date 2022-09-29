import Table from "../../../table/Table"
import Pagination from "../../../pagination/Pagination"
import { useState } from "react"
import useTokensTable from "../../../../hooks/useTokensTable"
import useRange from "../../../../hooks/useRange"
import { useGetTotalLockCount } from "../../../../hooks/vault/useGetTotalLockCount"
import { useGetTotalTokenCount } from "../../../../hooks/vault/useGetTotalTokenCount"

const TokenIndex = () => {

    const [startIndex, setStartIndex] = useState<number>(0)
    const [endIndex, setEndIndex] = useState<number>(10)

    const lockCount = useGetTotalLockCount()
    const tokenCount = useGetTotalTokenCount()

    const tokenIds = useRange(startIndex, endIndex)
    const table = useTokensTable(tokenIds)
    
    function handleIndexChange(startIndex: number, endIndex: number) {
        if (startIndex >= 0 && endIndex >= 0) {
            setStartIndex(startIndex)
            setEndIndex(endIndex)
        }
    }


    return (
        <div>
            <h1 className="text-xl font-semibold uppercase text-center">
                <span>{lockCount ? <>{lockCount.toString()}</> : <></>} Locks, </span>
                <span>{tokenCount ? <>{tokenCount.toString()}</> : <></>} Tokens</span>
            </h1>
            <Pagination handleIndexChange={handleIndexChange} totalItems={tokenCount ? tokenCount.toNumber() : 0} />
            <div className="border p-4 bg-white/10 mt-8">
                <Table headers={table.headers} rows={table.rows} />
            </div>
        </div>
    )
}

export default TokenIndex
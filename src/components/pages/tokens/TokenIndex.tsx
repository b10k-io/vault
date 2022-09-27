import { useGetTotalLockCount, useGetTotalTokenCount } from "../../../hooks/Vault"
import Table from "../../table/Table"
import Pagination from "../../table/Pagination"
import config from "../../../config"
import { useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"

const TokenIndex = () => {

    const [startIndex, setStartIndex] = useState<number | undefined>() // <number>(0)
    const [endIndex, setEndIndex] = useState<number | undefined>() // <number>(10)

    // const [range, setRange] = useState<BigNumber[]>([])

    const lockCount = useGetTotalLockCount(config.hardhat.vault)
    const tokenCount = useGetTotalTokenCount(config.hardhat.vault)

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
                <Table startIndex={startIndex} endIndex={endIndex} />
            </div>
        </div>
    )
}

export default TokenIndex
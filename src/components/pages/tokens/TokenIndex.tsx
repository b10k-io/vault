import { useGetTotalLockCount, useGetTotalTokenCount, useGetTokensBetween } from "../../../hooks/Vault"
import Table from "../../table/Table"
import Pagination from "../../table/Pagination"
import config from "../../../config"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

const TokenIndex = () => {

    const [startIndex, setStartIndex] = useState<number | undefined>() // <number>(0)
    const [endIndex, setEndIndex] = useState<number | undefined>() // <number>(10)

    const lockCount = useGetTotalLockCount(config.hardhat.vault)
    const tokenCount = useGetTotalTokenCount(config.hardhat.vault)

    function handleIndexChange(startIndex: number, endIndex: number) {
        setStartIndex(startIndex)
        setEndIndex(endIndex)
    }

    return (
        <div>
            <h1 className="text-xl font-semibold uppercase text-center">
                <span>{lockCount ? <>{lockCount.toString()}</> : <></>} Locks, </span>
                <span>{tokenCount ? <>{tokenCount.toString()}</> : <></>} Tokens</span>
            </h1>
            <Pagination handleIndexChange={handleIndexChange} totalItems={tokenCount ? tokenCount.toNumber() : 0} />
            <Table start={startIndex} end={endIndex} />
        </div>
    )
}

export default TokenIndex
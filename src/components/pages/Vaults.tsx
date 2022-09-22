import useGetTotalLockCount from "../../hooks/useGetTotalLockCount"
import Table from "../table/Table"
import config from "../../config"
import { formatEther, parseEther } from "../helpers/utils"
import useGetLocksBetweenIndex from "../../hooks/useGetLocksBetweenIndex"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Lock } from "../../types/Lock"

const Vaults = () => {

    const count = useGetTotalLockCount(config.hardhat.vault)
    const locks: Lock[] | undefined = useGetLocksBetweenIndex(config.hardhat.vault, parseEther(0), count)

    return (
        <div>
            <h1 className="text-xl font-semibold uppercase text-center">{count ? <>{count.toString()}</> : <></>} Vaults</h1>
            {JSON.stringify(locks)}
            <Table />
        </div>
    )
}

export default Vaults
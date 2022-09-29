import { usePublicLockTable } from "../../hooks/usePublicLockTable"
import { useGetLockIdsByToken } from "../../hooks/vault/useGetLockIdsByToken"
import Table from "../table/Table"

interface IPublicLockTable {
    tokenAddress: string
}

function PublicLockTable({ tokenAddress }: IPublicLockTable) {

    const lockIds = useGetLockIdsByToken(tokenAddress)
    const table = usePublicLockTable(lockIds)

    return(
        <Table headers={table.headers} rows={table.rows} />
    )
}

export default PublicLockTable
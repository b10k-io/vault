import { useLockTable } from "../../hooks/useLockTable"
import Table from "../table/Table"

interface ILockTable {
    tokenAddress: string
}

const LockTable = ({ tokenAddress }: ILockTable) => {

    const table = useLockTable(tokenAddress)

    return(
        <Table headers={table.headers} rows={table.rows} />
    )
}

export default LockTable
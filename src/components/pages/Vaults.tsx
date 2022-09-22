import { useGetTotalLockCount } from "../../hooks/Vault"
import Table from "../table/Table"
import config from "../../config"

const Vaults = () => {

    const count = useGetTotalLockCount(config.hardhat.vault)
    const start = 0

    return (
        <div>
            <h1 className="text-xl font-semibold uppercase text-center">{count ? <>{count.toString()}</> : <></>} Vaults</h1>
            <Table start={start} end={count} />
        </div>
    )
}

export default Vaults
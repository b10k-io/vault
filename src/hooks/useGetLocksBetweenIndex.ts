import { useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";
import { Lock } from "../types/Lock";

function useGetLocksBetweenIndex(address: string | undefined, start: BigNumber | undefined, end: BigNumber | undefined): Lock[] | undefined {
    console.log("useGetLocksBetweenIndex", address, start?.toString(), end?.toString())
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLocksBetweenIndex",
        args: [start, end]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        console.log("value", value)
        return value?.[0]
    }
}

export default useGetLocksBetweenIndex
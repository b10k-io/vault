import { useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";

function useGetTotalLockCount(address: string | undefined): BigNumber | undefined {
    console.log("useGetTotalLockCount", address);
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getTotalLockCount",
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        console.log("useGetTotalLockCount", value?.[0])
        return value?.[0]
    }
}

export default useGetTotalLockCount
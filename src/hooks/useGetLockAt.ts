import { useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";

function useGetLockAt(address: string | undefined, index: BigNumber): any | undefined {
    console.log("useGetLockAt", address, index);
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLockAt",
        args: [index]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        console.log("useGetLockAt", value?.[0])
        return value?.[0]
    }
}

export default useGetLockAt
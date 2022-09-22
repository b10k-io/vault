import { useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";
import { Lock } from "../types/Lock";

export function useGetLocksBetweenIndex(address: string | undefined, start: BigNumber | number | undefined, end: BigNumber | number | undefined): Lock[] | undefined {
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
        console.log("value", value?.[0])
        return value?.[0]
    }
}

export  function useGetTotalLockCount(address: string | undefined): BigNumber | undefined {
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
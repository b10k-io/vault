import { useCall, useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";
import { Lock } from "../types/Lock";

export function useGetLocksBetweenIndex(address: string | undefined, start: BigNumber | number | undefined, end: BigNumber | number | undefined): Lock[] | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLocksBetweenIndex",
        args: [start, end]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

export  function useGetTotalLockCount(address: string | undefined): BigNumber | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getTotalLockCount",
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

function useGetLockAt(address: string | undefined, index: BigNumber): any | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLockAt",
        args: [index]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

export function useGetTotalTokenCount(address: string | undefined): BigNumber | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getTotalTokenCount",
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

export function useGetTokensBetween(address: string | undefined, start: BigNumber | number | undefined, end: BigNumber | number | undefined): string[] | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getTokensBetween",
        args: [start, end]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

export function useGetLockedAmountByToken(address: string | undefined, token: string | undefined): BigNumber | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLockedAmountByToken",
        args: [token]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}

export function useGetLockedAmountByTokens(address: string | undefined, addresses: string[] | undefined): (BigNumber | undefined)[] {
    const calls = addresses?.map(addr => (address && {
        contract: new Contract(address, IVault.abi),
        method: 'getLockedAmountByToken',
        args: [addr]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'getLockedAmountByToken' on ${address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}
import { useCall, useCalls } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../interfaces/IVault.json";
import { ILock } from "../types/ILock";

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

function useLockById(address: string | undefined, index: BigNumber): any | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLockById",
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

export function useGetTokensByIds(address: string | undefined, idList: BigNumber[]): string[] {
    const calls = idList?.map(id => (address && {
        contract: new Contract(address, IVault.abi),
        method: 'getTokenById',
        args: [id]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'getTokenById' on ${address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0]).filter(Boolean) as string[]
}

export function useTokensByIds(address: string | undefined, tokenIds: (number | BigNumber)[]): string[] {
    const calls = tokenIds?.map(id => (address && {
        contract: new Contract(address, IVault.abi),
        method: 'getTokenById',
        args: [BigNumber.from(id)]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'getTokenById' on ${address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0]).filter(Boolean) as string[]
}

export function useLockedAmounts(address: string, tokens: string[] | undefined): (BigNumber | undefined)[] {
    const calls = tokens?.map(token => ({
        contract: new Contract(address, IVault.abi),
        method: 'getLockedAmountByToken',
        args: [token]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'name' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}

export function useLockIdsByToken(address: string, token: string): BigNumber[] | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IVault.abi),
        method: "getLockIdsByToken",
        args: [token]
    }) ?? {}
    if (error) {
        console.error(error.message)
    } else {
        return value?.[0].filter(Boolean) as BigNumber[]
    }
}

export function useLockByIds(address: string, lockIds: BigNumber[] | undefined): ILock[] | undefined {
    const calls = lockIds?.map(lockId => ({
        contract: new Contract(address, IVault.abi),
        method: 'getLockById',
        args: [lockId]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'getLockById' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0]).filter(Boolean)
}
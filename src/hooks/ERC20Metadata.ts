import { useCall, useCalls } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IERC20Metadata from "../interfaces/IERC20Metadata.json"

export function useName(address: string | undefined): string | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'name',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export function useTotalSupply(address: string | undefined): BigNumber | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'totalSupply',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export function useSymbol(address: string | undefined): string | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'symbol',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export function useDecimal(address: string | undefined): BigNumber | undefined {
    const { value, error } = useCall(address && {
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'decimals',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export function useNames(addresses: string[] | undefined): (string | undefined)[] {
    const calls = addresses?.map(address => ({
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'name',
        args: []
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'name' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}

export function useTotalSupplies(addresses: string[] | undefined): (BigNumber | undefined)[] {
    const calls = addresses?.map(address => ({
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'totalSupply',
        args: []
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'totalSupply' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}

export function useSymbols(addresses: string[] | undefined): (string | undefined)[] {
    const calls = addresses?.map(address => ({
        contract: new Contract(address, IERC20Metadata.abi),
        method: 'symbol',
        args: []
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'symbol' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}
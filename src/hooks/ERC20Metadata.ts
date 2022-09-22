import { useCall } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IERC20Metadata from "../interfaces/IERC20Metadata.json"

export function useName(address: string | undefined): string | undefined {
    console.log("useName", address)
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

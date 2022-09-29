import { useCall } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IERC20Metadata from "../../interfaces/IERC20Metadata.json"

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
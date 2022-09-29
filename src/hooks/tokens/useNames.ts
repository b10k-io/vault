import { useCalls } from "@usedapp/core"
import { Contract } from "ethers"
import IERC20Metadata from "../../interfaces/IERC20Metadata.json"

export function useNames(tokenAddresses: string[] | undefined): (string | undefined)[] {
    const calls = tokenAddresses?.map(address => ({
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
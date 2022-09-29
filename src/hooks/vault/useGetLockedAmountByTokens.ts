import { useCalls } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IVault from "../../interfaces/IVault.json"
import useVaultAddress from "../useVaultAddress"

export function useGetLockedAmountByTokens(tokensAddresses: string[] | undefined): (BigNumber | undefined)[] {
    const vaultAddress = useVaultAddress()
    const calls = tokensAddresses?.map(address => ({
        contract: new Contract(vaultAddress, IVault.abi),
        method: 'getLockedAmountByToken',
        args: [address]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'name' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}
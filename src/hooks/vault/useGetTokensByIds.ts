import { useCalls } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import useVaultAddress from "../useVaultAddress"
import IVault from "../../interfaces/IVault.json"

export function useGetTokensByIds(idArray: BigNumber[]): string[] {
    const vaultAddress = useVaultAddress()
    const calls = idArray?.map(id => ({
        contract: new Contract(vaultAddress, IVault.abi),
        method: 'getTokenById',
        args: [id]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'getTokenById' on ${vaultAddress}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0]).filter(Boolean) as string[]
}
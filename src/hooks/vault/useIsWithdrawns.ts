import { useCalls } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IVault from "../../interfaces/IVault.json"
import useVaultAddress from "../useVaultAddress"

export function useIsWithdrawns(lockIds: BigNumber[] | undefined): boolean[] {
    const vaultAddress = useVaultAddress()
    const calls = lockIds?.map(lockId => ({
        contract: new Contract(vaultAddress, IVault.abi),
        method: 'isWithdrawn',
        args: [lockId]
    })) ?? []
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if (result && result.error) {
            console.error(`Error encountered calling 'isWithdrawn' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })
    return results.map(result => result?.value?.[0])
}
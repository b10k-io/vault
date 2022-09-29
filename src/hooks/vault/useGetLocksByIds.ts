import { useCalls } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import IVault from "../../interfaces/IVault.json"
import { ILock } from "../../types/ILock"
import useVaultAddress from "../useVaultAddress"

export function useGetLocksByIds(lockIds: BigNumber[] | undefined): ILock[] {
    const vaultAddress = useVaultAddress()
    const calls = lockIds?.map(lockId => ({
        contract: new Contract(vaultAddress, IVault.abi),
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
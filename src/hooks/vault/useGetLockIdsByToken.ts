import { useCall } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import useVaultAddress from "../useVaultAddress"
import IVault from "../../interfaces/IVault.json"

export function useGetLockIdsByToken(token: string): BigNumber[] | undefined {
    const vaultAddress = useVaultAddress()
    const { value, error } = useCall(vaultAddress && {
        contract: new Contract(vaultAddress, IVault.abi),
        method: "getLockIdsByToken",
        args: [token]
    }) ?? {}
    if (error) {
        console.error(error.message)
    } else {
        return value?.[0].filter(Boolean) as BigNumber[]
    }
}
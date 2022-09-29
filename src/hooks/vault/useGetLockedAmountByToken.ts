import { useCall } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import useVaultAddress from "../useVaultAddress"
import IVault from "../../interfaces/IVault.json"

export function useGetLockedAmountByToken(tokenAddress: string | undefined): BigNumber | undefined {
    const vaultAddress = useVaultAddress()
    const { value, error } = useCall({
        contract: new Contract(vaultAddress, IVault.abi),
        method: "getLockedAmountByToken",
        args: [tokenAddress]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}
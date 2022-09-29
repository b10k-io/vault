import { useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import IVault from "../../interfaces/IVault.json";
import useVaultAddress from "../useVaultAddress";

export function useGetLockIdsByOwner(address: string | undefined): BigNumber[] | undefined {
    const vaultAddress = useVaultAddress()
    const { value, error } = useCall({
        contract: new Contract(vaultAddress, IVault.abi),
        method: "getLockIdsByOwner",
        args: [address]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } else {
        return value?.[0]
    }
}
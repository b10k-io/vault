import { useEthers, ChainId } from "@usedapp/core"
import { useExtendedChainMeta } from "./useExtendedChainMeta"

const useVaultAddress = (): string => {
    const { chainId } = useEthers()
    const { vaultAddress } = useExtendedChainMeta(chainId as ChainId)
    return vaultAddress
}

export default useVaultAddress
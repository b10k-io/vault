import { ChainId } from "@usedapp/core"
import { ChainExtended } from "../constants/types/ChainExtended"
import * as chains from "../model/chain"

export function getExtendedChainMeta(chainId: ChainId): ChainExtended {
    const chain = Object.values(chains).find((chain) => chain.chainId === chainId)
    if (!chain) {
        throw new Error(`Chain ${chainId} does not exist`)
    }
    return chain
}
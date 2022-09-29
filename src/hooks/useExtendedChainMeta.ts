import { ChainId } from "@usedapp/core";
import { useMemo } from "react";
import { ChainExtended } from "../constants/types/ChainExtended";
import { getExtendedChainMeta } from "../helpers/getExtendedChainMeta";

export function useExtendedChainMeta(chainId: ChainId): ChainExtended {
    return useMemo(() => getExtendedChainMeta(chainId), [chainId])
}
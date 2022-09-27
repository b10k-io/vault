import { ILock } from "../types/ILock"
import { useLockIdsByToken, useLockByIds } from "./Vault"

export function useLockTable(address: string, tokenAddress: string): ILock[] | undefined {
    const lockIds = useLockIdsByToken(address, tokenAddress)
    const locks: ILock[] | undefined = useLockByIds(address, lockIds)
    return locks
}
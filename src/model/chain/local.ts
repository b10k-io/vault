import { Hardhat } from "@usedapp/core"
import { ChainExtended } from "../../constants/types/ChainExtended"

export const HardhatExtended: ChainExtended = {
    ...Hardhat,
    rpcUrl: "http://127.0.0.1:8545/",
    blockExplorerUrl: "http://localhost:3000/",
    vaultAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    getExplorerAddressLink: (address: string) => HardhatExtended.blockExplorerUrl + "address/" + address,
    getExplorerTransactionLink: (tx: string) => Hardhat.blockExplorerUrl + "tx/" + tx
}
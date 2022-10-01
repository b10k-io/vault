import { useContractFunction } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import useVaultAddress from "../../hooks/useVaultAddress"
import IVault from "../../interfaces/IVault.json"
import Spin from "../svg/Spin";

interface IWithdrawButton {
    lockId: BigNumber
    isWithdrawn: boolean
    canWithdraw: boolean
}

function WithdrawButton({ lockId, isWithdrawn, canWithdraw }: IWithdrawButton) {

    const vaultAddress = useVaultAddress()
    const { state, send } = useContractFunction(new Contract(vaultAddress, IVault.abi), 'withdraw', { transactionName: 'Withdraw' })
    
    function handleClick() {
        send(lockId)
    }

    return (
        <button 
            onClick={handleClick} 
            className="border border-orange-300 py-1 px-2 text-orange-300 enabled:hover:underline disabled:opacity-10" 
            disabled={isWithdrawn || !canWithdraw}>
                <div className="flex items-center gap-1">
                    <Spin textColor="text-orange-300" show={state.status === "Mining"} />
                    <div>Withdraw</div>
                </div>
        </button>
    )
}

export default WithdrawButton
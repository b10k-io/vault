import { BigNumber } from "ethers"

interface IExtendButton {
    lockId: BigNumber
    isWithdrawn: boolean
}

function ExtendButton({ lockId, isWithdrawn }: IExtendButton) {

    function handleClick() {
        console.log("WithdrawButton.handleClick()", lockId)
    }

    return (
        <button 
            onClick={handleClick} 
            className="border border-blue-400 py-1 px-2 text-blue-400 enabled:hover:underline disabled:opacity-10" 
            disabled={isWithdrawn}>
                Extend
        </button>
    )
}

export default ExtendButton
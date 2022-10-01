import { useState } from "react"
import { ILock } from "../../types/ILock"
import ExtendTimeDialog from "../dialog/ExtendTimeDialog"

interface IExtendButton {
    lock: ILock
    isWithdrawn: boolean
}

function ExtendButton({ lock, isWithdrawn }: IExtendButton) {

    const [showDialog, setShowDialog] = useState<boolean>(false)

    function handleClick() {
        console.log("ExtendButton.handleClick()", lock.id)
        setShowDialog(true)
    }

    return (
        <>
            <button 
                onClick={handleClick} 
                className="enabled:hover:underline disabled:opacity-10"
                disabled={isWithdrawn}>
                    Extend
            </button>
            { showDialog && <ExtendTimeDialog lock={lock} onClose={() => setShowDialog(false)} />}
        </>
    )
}

export default ExtendButton
import { Dialog } from "@headlessui/react"
import { TransactionStatus, useContractFunction, useToken } from "@usedapp/core"
import { BigNumber, Contract } from "ethers"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import useVaultAddress from "../../hooks/useVaultAddress"
import IVault from "../../interfaces/IVault.json"
import { formatCommify } from "../helpers/utils"
import Spin from "../svg/Spin"

interface IFormCreateLock {
    onClose: () => void
    onSubmit: (data: any) => void
    state: TransactionStatus
}

function FailCreateLock() {
    return (
        <>
            <Dialog.Description className="my-8 text-base">
                Oh no! Something went wrong and your transaction failed. Please try again.
            </Dialog.Description>
        </>
    )
}

function SuccessCreateLock() {
    return (
        <>
            <Dialog.Description className="my-8 text-base">
                Great job! You created a lock!
            </Dialog.Description>
        </>
    )
}

function FormCreateLock({ onSubmit, onClose, state }: IFormCreateLock) {

    const min = getCurrentDateTimeLocal()
    const [tokenAddress, setTokenAddress] = useState<string | undefined>()

    const tokenInfo = useToken(tokenAddress)

    const { register, handleSubmit, formState, formState: { errors }, getValues } = useForm({ defaultValues: { 
        token: "",
        unlockTime: min 
    }})

    useEffect(() => {
        const address = getValues("token")
        setTokenAddress(address)
    }, [formState.touchedFields.token])

    return (
        <>
            <Dialog.Description className="my-8 text-base">
                This will permanently extend the time until unlock. This action cannot be undone.
            </Dialog.Description>

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex flex-col gap-4">

                    <div>
                        <input type="text" {...register("token", { required: true })} />
                    </div>

                    { tokenInfo ? 
                        <table>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>{tokenInfo.name}</td>
                                </tr>
                                <tr>
                                    <td>Symbol</td>
                                    <td>{tokenInfo.symbol}</td>
                                </tr>
                                <tr>
                                    <td>Total Supply</td>
                                    <td>{tokenInfo.totalSupply ? <>{formatCommify(tokenInfo.totalSupply as BigNumber)}</> : <></>}</td>
                                </tr>
                                <tr>
                                    <td>Decimals</td>
                                    <td>{tokenInfo.decimals}</td>
                                </tr>
                            </tbody>
                        </table>
                        : <></>
                    }

                </div>


                <div className="text-black">
                    {/* <input type="datetime-local" {...register("unlockTime", { required: true, min: min })} /> */}
                    {/* <div className='h-4 my-2'>{errors.unlockTime && <div className='text-xs text-red-500'>Must be greater than {formatTimestamp(lock.unlockTime.mul(1000))}.</div>}</div> */}
                </div>
                <div className="flex justify-between items-center mt-8">
                    <button type="submit" className="border py-1 px-2 text-base enabled:hover:underline enabled:hover:bg-white enabled:hover:text-black disabled:opacity-50" disabled={!!Object.keys(errors).length}>
                        <div className="flex items-center gap-1">
                            <Spin show={state.status === "Mining"} />
                            <div>Extend</div>
                        </div>
                    </button>
                    <button onClick={onClose} className="border hover:bg-white hover:text-black py-1 px-2 text-base">Cancel</button>
                </div>
            </form>
        </>
    )
}

function CreateLockDialog() {

    const vaultAddress = useVaultAddress()
    const { state, send } = useContractFunction(new Contract(vaultAddress, IVault.abi), 'extend', { transactionName: 'Extend' })

    const [isOpen, setIsOpen] = useState(true)
    const [failed, setFailed] = useState(false)
    const [succeeded, setSucceeded] = useState(false)

    function handleClose() {
        setIsOpen(false)
    }

    function onSubmit(data: any) {
        // const d = new Date(data.unlockTime)
        // const t = d.getTime()
        // const n = BigNumber.from(t).div(1000)
        // console.log("onSubmit", n.toString())
        // send(lock.id, n)
    }

    useEffect(() => {
        console.log(state.status)
        switch (state.status) {
            case "Fail":
                setFailed(true)
                break;
            case "Success":
                setSucceeded(true)
                break;
            default:
                break;
        }
    }, [state.status])

    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-xs bg-black border p-4 font-mono">
                        <Dialog.Title>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold uppercase">Create you Lock</h3>
                                <button onClick={handleClose} className="border hover:bg-white hover:text-black py-1 px-2 text-xs">𝗫</button>
                            </div>
                        </Dialog.Title>
                        {failed ? <FailCreateLock /> : succeeded ? <SuccessCreateLock /> : <FormCreateLock onSubmit={onSubmit} onClose={handleClose} state={state} />}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}

export default CreateLockDialog

function getCurrentDateTimeLocal() {
    throw new Error("Function not implemented.")
}

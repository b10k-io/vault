import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { BigNumber, Contract } from 'ethers'
import { ILock } from '../../types/ILock'
import { useForm } from "react-hook-form";
import { formatTimestamp } from '../helpers/utils'
import { TransactionStatus, useContractFunction } from '@usedapp/core';
import useVaultAddress from '../../hooks/useVaultAddress';
import IVault from "../../interfaces/IVault.json"
import Spin from '../svg/Spin';
import moment from 'moment';

interface IExtendTimeDialogBasic {
    lock: ILock
}

interface IExtendTimeDialog extends IExtendTimeDialogBasic {
    onClose: () => void
}

interface IExtendTimeDialogFull extends IExtendTimeDialog {
    lock: ILock
    onSubmit: (data: any) => void
    state: TransactionStatus
}


function getDateTimeLocal(n: BigNumber): string {
    const t = n.add(60).mul(1000).toNumber()
    console.log(t)
    const d = moment(t)
    console.log(d)
    const s = d.format().substring(0,16)
    console.log(s)
    return s
}

function FailExtendTime({ lock }: IExtendTimeDialogBasic) {
    return (
        <>
            <Dialog.Description className="my-8 text-base">
                Oh no! Something went wrong and your transaction failed. Please try again.
            </Dialog.Description>
        </>
    )
}

function SuccessExtendTime({ lock }: IExtendTimeDialogBasic) {
    return (
        <>
            <Dialog.Description className="my-8 text-base">
                Great job! You exteneded the lock until: {formatTimestamp(lock.unlockTime.mul(1000))}.
            </Dialog.Description>
        </>
    )
}

function FormExtendTime({ lock, onSubmit, onClose, state }: IExtendTimeDialogFull) {

    const min = getDateTimeLocal(lock.unlockTime)

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { unlockTime: min } })

    return (
        <>
            <Dialog.Description className="my-8 text-base">
                This will permanently extend the time until unlock. This action cannot be undone.
            </Dialog.Description>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-black">
                    <input type="datetime-local" {...register("unlockTime", { required: true, min: min })} />
                    <div className='h-4 my-2'>{errors.unlockTime && <div className='text-xs text-red-500'>Must be greater than {formatTimestamp(lock.unlockTime.mul(1000))}.</div>}</div>
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

function ExtendTimeDialog({ lock, onClose }: IExtendTimeDialog) {

    const vaultAddress = useVaultAddress()
    const { state, send } = useContractFunction(new Contract(vaultAddress, IVault.abi), 'extend', { transactionName: 'Extend' })

    const [isOpen, setIsOpen] = useState(true)
    const [failed, setFailed] = useState(false)
    const [succeeded, setSucceeded] = useState(false)

    function handleClose() {
        setIsOpen(false)
        onClose()
    }

    function onSubmit(data: any) {
        const d = new Date(data.unlockTime)
        const t = d.getTime()
        const n = BigNumber.from(t).div(1000)
        console.log("onSubmit", n.toString())
        send(lock.id, n)
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
                                <h3 className="text-xl font-semibold uppercase">Extend Lock ({lock.id.toNumber()})</h3>
                                <button onClick={handleClose} className="border hover:bg-white hover:text-black py-1 px-2 text-xs">𝗫</button>
                            </div>
                        </Dialog.Title>
                        {failed ? <FailExtendTime lock={lock} /> : succeeded ? <SuccessExtendTime lock={lock} /> : <FormExtendTime lock={lock} onSubmit={onSubmit} onClose={handleClose} state={state} />}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}

export default ExtendTimeDialog
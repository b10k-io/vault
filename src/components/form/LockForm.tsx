import { ERC20Interface, useContractFunction, useEthers, useToken } from "@usedapp/core"
import { TokenInfo } from "@usedapp/core/dist/esm/src/model/TokenInfo"
import { BigNumber, Contract } from "ethers"
import { isAddress, parseEther } from "ethers/lib/utils"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useVaultAddress from "../../hooks/useVaultAddress"
import { formatCommify } from "../helpers/utils"
import Spin from "../svg/Spin"
import { Navigate } from "react-router-dom"
import IVault from "../../interfaces/IVault.json"

interface ITokenTable {
    tokenAddress: string | undefined
}

function TokenTable({ tokenAddress }: ITokenTable) {
    const tokenInfo = useToken(tokenAddress)

    if (tokenInfo) {
        return (
            <table className="w-full table-auto text-sm">
                <tbody>
                    <tr>
                        <td className="p-2 text-white/60">Name</td>
                        <td className="p-2 text-white/60 text-right">{tokenInfo.name}</td>
                    </tr>
                    <tr>
                        <td className="p-2 text-white/60">Symbol</td>
                        <td className="p-2 text-white/60 text-right">{tokenInfo.symbol}</td>
                    </tr>
                    <tr>
                        <td className="p-2 text-white/60">Decimals</td>
                        <td className="p-2 text-white/60 text-right">{tokenInfo.decimals}</td>
                    </tr>
                    <tr>
                        <td className="p-2 text-white/60">Total Supply</td>
                        <td className="p-2 text-white/60 text-right">{formatCommify(tokenInfo.totalSupply as BigNumber)} {tokenInfo.symbol}</td>
                    </tr>
                </tbody>
            </table>
        )
    } else {
        return <></>
    }
}

function getCurrentDateTimeLocal(d: moment.Moment): string {
    const s = d.format().substring(0, 16)
    return s
}

function getBlockTimestamp(s: string): BigNumber {
    const d = new Date(s)
    const t = d.getTime()
    const n = BigNumber.from(t).div(1000)
    return n
}

type FormValues = {
    token: string
    owner: string
    amount: string
    unlockTime: string
}

function LockForm() {

    const { account } = useEthers()
    const [isAnotherOwner, setIsAnotherOwner] = useState<boolean>(false)

    const { register, handleSubmit, watch, formState: { errors }, setValue, getFieldState } = useForm<FormValues>({
        defaultValues: {
            owner: account,
        },
    })

    const tokenAddress = watch("token")
    const amount = watch("amount")

    const vaultAddress = useVaultAddress()

    const { state: approvalState, send: sendApproval } = useContractFunction(isAddress(tokenAddress) && new Contract(tokenAddress, ERC20Interface), 'approve', { transactionName: 'Approve' })
    const { state: depositState, send: sendDeposit } = useContractFunction(vaultAddress && new Contract(vaultAddress, IVault.abi), 'deposit', { transactionName: 'Deposit' })

    function onSubmit(data: any) {
        console.log(data)
        if (approvalState.status === "Success") {
            const unlockTime = getBlockTimestamp(data.unlockTime)
            const amount = parseEther(data.amount)
            sendDeposit(data.token, data.owner, amount, unlockTime)
        }
    }

    function onClickApprove() {
        const amt = parseEther(amount)
        sendApproval(vaultAddress, amt)
    }

    useEffect(() => {
        if (!isAnotherOwner && account) {
            setValue("owner", account)
        }
    }, [isAnotherOwner, account])

    function validateToken(tokenAddress: string): boolean {
        console.log("validateToken", tokenAddress)
        return isAddress(tokenAddress)
    }

    return (
        <>
            {
                depositState.status === "Success" ? <Navigate to={`/tokens/${tokenAddress}`} /> :
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Token Address</label>
                                <input type={"text"} {...register("token", { required: true, validate: validateToken })} className="text-black p-2 focus:outline-none" />
                                <div className='h-4'>{errors.token && <div className='text-xs text-red-500'>Must be an existing token address.</div>}</div>
                                <div>{isAddress(tokenAddress) && <TokenTable tokenAddress={tokenAddress} />}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input id="isAnotherOwner" type={"checkbox"} onChange={() => setIsAnotherOwner(!isAnotherOwner)} />
                                    <label htmlFor="isAnotherOwner" className="text-sm">use another owner</label>
                                </div>
                                {isAnotherOwner &&
                                    <>
                                        <label className="text-sm">Owner Address</label>
                                        <input type={"text"} {...register("owner", { required: true, validate: isAddress })} className="text-black p-2 focus:outline-none" />
                                        <div className="text-xs">The address you input here will be receive the tokens once they are unlocked</div>
                                        <div className='h-4'>{errors.token && <div className='text-xs text-red-500'>Must be an existing token.</div>}</div>
                                    </>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Amount</label>
                                <input type={"text"} {...register("amount", { required: true })} className="text-black p-2 focus:outline-none" />
                                <div className='h-4'>{errors.unlockTime && <div className='text-xs text-red-500'>You must specify the amount!</div>}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Unlock Date & Time</label>
                                <input type="datetime-local" {...register("unlockTime", { required: true, min: getCurrentDateTimeLocal(moment()) })} className="text-black p-2 focus:outline-none" />
                                <div className='h-4'>{errors.unlockTime && <div className='text-xs text-red-500'>Must be in the future!</div>}</div>
                            </div>

                            <div className="text-center">
                                {approvalState.status === "Success" ?
                                    <button type="submit" className="border py-1 px-2 text-base enabled:hover:underline enabled:hover:bg-white enabled:hover:text-black disabled:opacity-50" disabled={!!Object.keys(errors).length}>
                                        <div className="flex items-center gap-1">
                                            <Spin textColor="text-black" show={depositState.status === "Mining"} />
                                            <div>Create Lock</div>
                                        </div>
                                    </button>
                                    : <button onClick={onClickApprove} className="border py-1 px-2 text-base enabled:hover:underline enabled:hover:bg-white enabled:hover:text-black disabled:opacity-50" disabled={!!Object.keys(errors).length}>
                                        <div className="flex items-center gap-1">
                                            <Spin textColor="text-black" show={approvalState.status === "Mining"} />
                                            <div>Approve</div>
                                        </div>
                                    </button>}
                            </div>
                        </div>
                    </form>
            }
        </>
    )
}

export default LockForm
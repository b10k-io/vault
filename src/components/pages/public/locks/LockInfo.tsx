import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import { useSymbol } from "../../../../hooks/tokens/useSymbol"
import { useTotalSupply } from "../../../../hooks/tokens/useTotalSupply"
import { useGetLockedAmountByToken } from "../../../../hooks/vault/useGetLockedAmountByToken"
import { formatCommify, formatEther, parseEther } from "../../../helpers/utils"

interface ILockInfo {
    tokenAddress: string
}

const LockInfo = ({ tokenAddress }: ILockInfo) => {

    const symbol = useSymbol(tokenAddress)
    const totalSupply = useTotalSupply(tokenAddress)
    const lockedAmount = useGetLockedAmountByToken(tokenAddress)

    const [percent, setPercent] = useState<BigNumber | undefined>()


    useEffect(() => {
        if (lockedAmount && totalSupply) {
            // // BigNumber doesn't handle % well
            const cLockedAmount = parseFloat(formatEther(lockedAmount))
            const cTotalSupply = parseFloat(formatEther(totalSupply))

            let percent: number | string | BigNumber = cLockedAmount / cTotalSupply * 100.0
            percent = parseEther(percent)
            setPercent(percent)
        }
    }, [lockedAmount, totalSupply])

    return (
        <>
            <h1 className="font-semibold uppercase">Lock Info</h1>
            <table className="table-auto w-full mt-4 text-sm">
                <tbody>
                    <tr>
                        <td className="py-4">Locked Amount</td>
                        <td className="py-4 text-right">{lockedAmount ? formatCommify(lockedAmount) : <></>} {symbol}</td>
                    </tr>
                    <tr>
                        <td className="py-4">Value Locked</td>
                        <td className="py-4 text-right">$</td>
                    </tr>
                    <tr>
                        <td className="py-4">% Of Total Supply Locked</td>
                        <td className="py-4 text-right">{percent ? <>{formatCommify(percent)}%</> : <></>}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default LockInfo
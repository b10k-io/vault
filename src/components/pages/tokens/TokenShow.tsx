import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import config from "../../../config"
import { useDecimal, useName, useSymbol, useTotalSupply } from "../../../hooks/ERC20Metadata"
import { useGetLockedAmountByToken } from "../../../hooks/Vault"
import { formatCommify, formatEther, parseEther } from "../../helpers/utils"

const TokenShow = () => {

    const { address } = useParams()
    const name = useName(address)
    const symbol = useSymbol(address)
    const decimals = useDecimal(address)
    const totalSupply = useTotalSupply(address)
    const lockedAmount = useGetLockedAmountByToken(config.hardhat.vault, address)

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
            <div className="flex gap-16">
                <div className="basis-1/2 border p-4 bg-white/10">
                    <h1 className="font-semibold uppercase">Token Info</h1>
                    <table className="table-auto w-full mt-4 text-sm">
                        <tbody>
                            <tr>
                                <td className="py-4">Address</td>
                                <td className="py-4 text-right">{address}</td>
                            </tr>
                            <tr>
                                <td className="py-4">Name</td>
                                <td className="py-4 text-right">{name}</td>
                            </tr>
                            <tr>
                                <td className="py-4">Symbol</td>
                                <td className="py-4 text-right">{symbol}</td>
                            </tr>
                            <tr>
                                <td className="py-4">Decimals</td>
                                <td className="py-4 text-right">{decimals ? formatUnits(decimals, 0) : <></>}</td>
                            </tr>
                            <tr>
                                <td className="py-4">Total Supply</td>
                                <td className="py-4 text-right">{totalSupply ? formatCommify(totalSupply) : <></>}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="basis-1/2 border p-4 bg-white/10">
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
                    </table></div>
            </div>
        </>
    )
}

export default TokenShow
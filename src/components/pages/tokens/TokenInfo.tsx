import { useEthers, useChainMeta, ChainId } from "@usedapp/core"
import { formatUnits } from "ethers/lib/utils"
import { useName, useSymbol, useDecimal, useTotalSupply } from "../../../hooks/ERC20Metadata"
import { formatCommify } from "../../helpers/utils"

interface ITokenInfo {
    tokenAddress: string
}

const TokenInfo = ({ tokenAddress }: ITokenInfo) => {

    const { chainId } = useEthers()
    const meta = useChainMeta(chainId as ChainId)

    const name = useName(tokenAddress)
    const symbol = useSymbol(tokenAddress)
    const decimals = useDecimal(tokenAddress)
    const totalSupply = useTotalSupply(tokenAddress)

    return (
        <>
            <h1 className="font-semibold uppercase">Token Info</h1>
            <table className="table-auto w-full mt-4 text-sm">
                <tbody>
                    <tr>
                        <td className="py-4">Address</td>
                        <td className="py-4 text-right">
                            <a href={meta.getExplorerAddressLink(tokenAddress)} className="hover:underline" target="_blank">{tokenAddress}</a></td>
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
        </>
    )
}

export default TokenInfo
import { useParams } from "react-router-dom"
import LockTable from "../../locks/LockTable"
import LockInfo from "../locks/LockInfo"
import TokenInfo from "./TokenInfo"

const TokenShow = () => {

    const { address } = useParams()
    
    return (
        <>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="basis-1/2 border p-4 bg-white/10">
                    { address && <TokenInfo tokenAddress={address} />}
                </div>
                <div className="basis-1/2 border p-4 bg-white/10">
                    { address && <LockInfo tokenAddress={address} />}
                </div>
            </div>
            <div className="mt-8 border p-4 bg-white/10">
                { address && <LockTable tokenAddress={address} />}
            </div>
        </>
    )
}

export default TokenShow
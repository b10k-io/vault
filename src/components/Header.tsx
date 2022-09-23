import MetamaskConnect from "./MetamaskConnect"
import { useEthers, shortenIfAddress } from "@usedapp/core"
import { Link } from "react-router-dom"
import useAuth from "./helpers/useAuth"

const Header = () => {

    const { account } = useEthers()

    return (
        <header className="pt-8 pb-16">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                <Link to="/">
                    <div className="uppercase font-mono">
                        <div className="border-y-4 border-white">
                            <h1 className="font-semibold text-3xl">The Vault</h1>
                            <h2 className="tracking-tight font-light text-sm">Secure Token Locking</h2>
                        </div>
                    </div>
                </Link>
                </div>
                <div className="flex gap-4 items-center text-sm">
                    { account ? <><span className="text-slate-600">{shortenIfAddress(account)}</span> <span>|</span></> : <></>}
                    { useAuth() && <Link to="/dashboard" className="hover:underline uppercase tracking-widest">Dashboard</Link>}
                    <Link to="tokens" className="hover:underline uppercase tracking-widest">Tokens</Link>
                    <MetamaskConnect />
                </div>
            </div>
        </header>
    )
}

export default Header
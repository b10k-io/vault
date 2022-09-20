import { useEthers } from "@usedapp/core"
import useAuth from "./helpers/useAuth"

const klass = "py-2 px-4 border border-white uppercase tracking-widest"

const MetamaskConnect = () => {

    const { account, deactivate, activateBrowserWallet } = useEthers()

    if (useAuth()) {
        return (
            <button className={klass} onClick={() => deactivate()}>Disconnect</button>
        )
    } else {
        return (
            <button className={klass} onClick={() => activateBrowserWallet()}>Connect</button>
        )
    }
}

export default MetamaskConnect
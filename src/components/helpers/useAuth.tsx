import { useEthers } from "@usedapp/core"

const useAuth = () => {

    const { account } = useEthers()

    if (account && account !== undefined) {
        return true
    } else {
        return false
    }
}

export default useAuth
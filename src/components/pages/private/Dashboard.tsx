import useAuth from "../../helpers/useAuth"
import { Navigate } from "react-router-dom"
import AccountLocks from "./AccountLocks"

const Dashboard = () => {
    
    if (useAuth()) {
        return (
            <>
                <AccountLocks />
            </>
        )
    } else {
        return <Navigate to="/" />
    }
}

export default Dashboard
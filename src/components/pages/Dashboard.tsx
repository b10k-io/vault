import useAuth from "../helpers/useAuth"
import { Navigate } from "react-router-dom"

const Dashboard = () => {
    if (useAuth()) {
        return (
            <h1>Dashboard</h1>
        )
    } else {
        return <Navigate to="/" />
    }
}

export default Dashboard
import useAuth from "../helpers/useAuth"
import { Navigate } from "react-router-dom"

const Dashboard = () => {

    console.log("useAuth()", useAuth())

    if (useAuth()) {
        return (
            <h1>Dashboard</h1>
        )
    } else {
        return <Navigate to="/" />
    }


}

export default Dashboard
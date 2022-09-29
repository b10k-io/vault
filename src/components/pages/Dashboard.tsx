import useAuth from "../helpers/useAuth"
import { Navigate } from "react-router-dom"
import TabGroup from "../tabs/TabGroup"

const Dashboard = () => {

    const groups = [
        {
            text: "Tab 1",
            element: <>Hello World!</>
        },
        {
            text: "Tab 2",
            element: <>Goodbye World!</>
        },
    ]
    
    if (useAuth()) {
        return (
            <>
                <h1>Dashboard</h1>
                <TabGroup groups={groups} />
            </>
        )
    } else {
        return <Navigate to="/" />
    }
}

export default Dashboard
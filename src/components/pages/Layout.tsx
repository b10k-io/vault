import Header from "../Header"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="container mx-auto px-4">
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout
import AuthPage from "@/pages/AuthPage"
import DashboardPage from "@/pages/DashboardPage"
import NotFound from "@/pages/NotFound"
import { Route, Routes } from "react-router-dom"

const RouteProvider = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default RouteProvider
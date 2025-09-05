import { ReactNode, useEffect, useState } from "react"
import Session from "../service/session"
import Navigate from "../service/navigator"
import Path, { RoutePath } from "@/services/PathRoutes"

type Props = {
    children: ReactNode
}

const AuthProvider = ({
    children
}: Props) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const path = Navigate.Path()

    const checkAuth = async () => {
        const authorization = Session.isTokenValid()
        setIsAuthorized(authorization)

        console.log(path);
        const route: RoutePath = Path.LIST_ROUTES
            .find((e) => e.route == path)

        if (authorization && !route.isAuthorized) {
            Navigate.Replace(Path.DASHBOARD_ROUTE)
        }

        if (!authorization && route.isAuthorized) {
            Navigate.Replace(Path.SIGN_IN_ROUTE)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <> {children} </>
    )
}

export default AuthProvider
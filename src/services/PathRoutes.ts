export type RoutePath = {
    route: string
    isAuthorized: boolean
}

class Path {
    static SIGN_IN_ROUTE = '/'
    static REGISTER_ROUTE = '/register'
    static DASHBOARD_ROUTE = '/dashboard'

    static LIST_ROUTES: RoutePath[] = [
        {
            route: this.SIGN_IN_ROUTE,
            isAuthorized: false
        },
        {
            route: this.REGISTER_ROUTE,
            isAuthorized: false
        },
        {
            route: this.DASHBOARD_ROUTE,
            isAuthorized: true
        },
    ]
}

export default Path
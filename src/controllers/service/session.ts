export default class Session {
    static setToken(jwtToken) {
        localStorage.setItem("__accessToken__", jwtToken);
    }

    static checkToken() {
        return localStorage.getItem('__accessToken__') != null
    }

    static getToken() {
        return localStorage.getItem('__accessToken__')
    }

    static removeToken() {
        localStorage.removeItem('__accessToken__')
    }

    static isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {

            const payload = token.split('.')[1];
            if (!payload) return false;

            const decoded = JSON.parse(atob(payload));
            const exp = decoded.exp;

            if (!exp) return false;

            const now = Math.floor(Date.now() / 1000);
            return exp > now;
        } catch (e) {
            console.error("Invalid JWT token:", e);
            return false;
        }
    }

    static removeWalletName() {
        localStorage.removeItem('walletName')
    }

    static setLatestTab(tab: string) {
        localStorage.setItem("__latestTab__", tab);
    }
    static getLatestTab(): string {
        return localStorage.getItem('__latestTab__')
    }
}
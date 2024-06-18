import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    constructor() {
        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return window.location.href = '#/login';
        }

        this.logout().then();
    }

    async logout() {

        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            })
        });
        const result = await response.json();
        console.log(result);

        AuthUtils.removeAuthInfo();

        window.location.href = '#/login';
    }
}
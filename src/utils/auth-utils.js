import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {

            return localStorage.getItem(key);

            // if(key === this.accessTokenKey) {
            //     return localStorage.getItem(this.accessTokenKey);
            // }
            // else if(key === this.refreshTokenKey) {
            //     return localStorage.getItem(this.refreshTokenKey);
            // }
            // else if(key === this.userInfoKey) {
            //     return localStorage.getItem(this.userInfoKey);
            // } else {
            //     return null;
            // }

        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey)
            }
        }
    }

    static async updateRefreshToken() {
        debugger
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);

        if(refreshToken) {
            const response =  await fetch(config + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && response.status === 200) {
                const tokens = await response.json();
                if(tokens && !tokens.error) {
                    this.setAuthInfo(tokens.accessTokenKey, tokens.refreshToken);
                    result = true;
                }
            }
        }

        if(!result) {
            this.removeAuthInfo();
        }
    }
}
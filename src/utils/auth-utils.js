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
        console.log(123)
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
}
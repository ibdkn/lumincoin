import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {
        let response = null;
        const result = {
            error: false,
            response: null
        };

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = null;

        if(useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if(token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if(body) {
            params.body = JSON.stringify(body)
        }

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        }
        catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if(useAuth && response.status === 401) {
                debugger
                if (!token) {
                    // there isn't token
                    window.location.href = '#/login';
                } else {
                    // token is old / not valid
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // request again
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '#/login';
                    }
                }
            }
        }

        return result;
    }
}
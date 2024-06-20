import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor() {

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return window.location.href = '#/main';
        }

        const that = this;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
            {
                name: 'remember-me',
                id: 'remember-me',
                element: null,
                valid: true,
            },
        ];

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.oninput = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.errorMessageElement = document.getElementById('common-error');
        this.processElement = document.getElementById('process-button');
        this.processElement.onclick = function () {
            that.login();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        this.validateForm();
    }

    validateForm() {
        const isValid = this.fields.every(item => item.valid);

        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async login() {
        if (this.validateForm()) {

            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            const rememberMe = this.fields.find(item => item.name === 'remember-me').element.checked;

            const result = await HttpUtils.request('/login', 'POST', false, {
                email,
                password,
                rememberMe
            })

            if (result.error || !result.response || (result.response && (
                    !result.response.tokens.accessToken ||
                    !result.response.tokens.refreshToken ||
                    !result.response.user.name ||
                    !result.response.user.lastName || !result.response.user.id
                )
            )) {
                this.errorMessageElement.style.display = 'block';
                setTimeout(()=> {
                    this.errorMessageElement.style.display = 'none';
                }, 3000)
                return;
            }

            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName
                }
            )

            window.location.href = '#/main';

            console.log(result);
        } else {

        }
    }
}
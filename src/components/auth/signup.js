import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Signup {
    constructor() {
        if(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return window.location.href = '#/main';
        }

        this.fullNameElement = document.getElementById('full-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.errorMessageElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.fullNameElement.value && this.fullNameElement.value.match(/([А-ЯЁ][а-яё]+[\-\s]?){3,}/)) {
            this.fullNameElement.classList.remove('is-invalid');
            this.fullNameElement.nextElementSibling.style.display = 'none';
        } else {
            this.fullNameElement.classList.add('is-invalid');
            this.fullNameElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailElement.nextElementSibling.style.display = 'none';
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordElement.nextElementSibling.style.display = 'none';
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }
        if(this.passwordRepeatElement.value && this.passwordElement.value === this.passwordRepeatElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatElement.nextElementSibling.style.display = 'none';
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    async signup() {
        this.errorMessageElement.style.display = 'none';

        const fullName = this.fullNameElement.value.split(' ');
        const name = fullName[1];
        const lastName = fullName[0];

        if (this.validateForm()) {

            const result = await HttpUtils.request('/signup', 'POST', {
                name: name,
                lastName: lastName,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            })

            if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
                this.errorMessageElement.style.display = 'block';
                return;
            }

            window.location.href = '#/login';

            console.log(result);
        } else {

        }
    }
}
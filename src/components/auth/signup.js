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

        const that = this;
        this.fields = [
            {
                name: 'full-name',
                id: 'full-name',
                element: null,
                regex: /([А-ЯЁ][а-яё]+[\-\s]?){3,}/,
                valid: false,
            },
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
                name: 'password-repeat',
                id: 'password-repeat',
                element: null,
                valid: false,
            },
        ];

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.oninput = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process-button');
        this.processElement.onclick = function () {
            that.signup();
        }
    }

    validateField(field, element) {
        const password = document.getElementById('password')
        const repeatPassword = document.getElementById('password-repeat');

        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            element.nextElementSibling.style.display = 'block';
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            element.nextElementSibling.style.display = 'none';
            field.valid = true;
        }
        if (password.value !== repeatPassword.value) {
            repeatPassword.classList.add('is-invalid');
            repeatPassword.nextElementSibling.style.display = 'block';
            repeatPassword.valid = false;
        } else if (password.value === repeatPassword.value) {
            repeatPassword.classList.remove('is-invalid');
            repeatPassword.nextElementSibling.style.display = 'none';
            repeatPassword.valid = true;
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

    async signup() {
        this.errorMessageElement.style.display = 'none';

        const fullName = this.fullNameElement.value.split(' ');
        const name = fullName[1];
        const lastName = fullName[0];

        if (this.validateForm()) {

            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: name,
                lastName: lastName,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            //todo
            // let errorMessage = null;
            // switch (result.response.message) {
            //     case 'User with given email already exist': {
            //         errorMessage = 'Введенный пароль уже зарегестрирован в системе';
            //     }
            // }
            // // 12345678Qq
            // console.log(result.response.message);
            // console.log(result.message);

            if (result.error || !result.response || (result.response && (!result.response.user.id
                || !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {

                this.errorMessageElement.innerText = 'Введенный пароль уже зарегестрирован в системе';
                this.errorMessageElement.style.backgroundColor = '#DC3545';
                this.errorMessageElement.style.display = 'block';
                setTimeout(()=> {
                    this.errorMessageElement.style.display = 'none';
                    this.errorMessageElement.innerText = '';
                }, 3000);
                return;
            }

            this.errorMessageElement.innerText = 'Вы успешно зарегестрировались в системе!';
            this.errorMessageElement.style.backgroundColor = '#198754';
            this.errorMessageElement.style.display = 'block';
            setTimeout(()=> {
                this.errorMessageElement.style.display = 'none';
                this.errorMessageElement.innerText = '';

                window.location.href = '#/login';
            }, 3000);
            console.log(result);
        } else {

        }
    }
}
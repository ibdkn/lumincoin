export class Login {
    constructor() {

        if(localStorage.getItem('accessToken')) {
            return window.location.href = '#/main';
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.errorMessageElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async login() {
        this.errorMessageElement.style.display = 'none';

        if (this.validateForm()) {

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
            });
            const result = await response.json();

            if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                this.errorMessageElement.style.display = 'block';
                return;
            }

            localStorage.setItem('accessToken', result.tokens.accessToken);
            localStorage.setItem('refreshToken', result.tokens.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({
                    id: result.user.id,
                    name: result.user.name,
                    lastName: result.user.lastName
                }
            ));

            window.location.href = '#/main';

            console.log(result);
        } else {

        }
    }
}
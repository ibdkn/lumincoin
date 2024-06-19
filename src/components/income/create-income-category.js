import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomeCategory {
    constructor() {
        const that = this;
        this.incomeCategoryInputElement = document.getElementById('incomeCategory');
        this.incomeCategoryButtonElement = document.getElementById('createNewCategory');

        this.incomeCategoryButtonElement.onclick = () => {
            that.createIncomeCategory(this.incomeCategoryInputElement.value);
        }
        this.incomeCategoryInputElement.oninput = () => {
            that.validateField.call(that, this.incomeCategoryInputElement, this);
        }
    }

    validateField() {
        let isValid = true;

        if (this.incomeCategoryInputElement.value) {
            this.incomeCategoryInputElement.classList.remove('is-invalid');
            this.incomeCategoryInputElement.nextElementSibling.style.display = 'none';
        } else {
            this.incomeCategoryInputElement.classList.add('is-invalid');
            this.incomeCategoryInputElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }

        this.validateForm(isValid);
    }

    validateForm(isValid) {
        if (isValid) {
            this.incomeCategoryButtonElement.removeAttribute('disabled');
        } else {
            this.incomeCategoryButtonElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async createIncomeCategory(title) {
        if(title) {
            const result = await HttpUtils.request('/categories/income', 'POST', true, {
                title
            });

            if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
                console.log('Ошибка создания категории');
                return;
            }
            location.href = '#/income'
        }
        else {
            console.log('Some error with input value');
        }
    }
}
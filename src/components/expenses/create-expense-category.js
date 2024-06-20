import {HttpUtils} from "../../utils/http-utils";

export class CreateExpenseCategory {
    constructor() {
        const that = this;
        this.expenseCategoryInputElement = document.getElementById('expenseCategory');
        this.expenseCategoryButtonElement = document.getElementById('createNewCategory');

        this.expenseCategoryButtonElement.onclick = () => {
            that.createExpenseCategory(this.expenseCategoryInputElement.value);
        }
        this.expenseCategoryInputElement.oninput = () => {
            that.validateField.call(that, this.expenseCategoryInputElement, this);
        }
    }

    validateField() {
        let isValid = true;

        if (this.expenseCategoryInputElement.value) {
            this.expenseCategoryInputElement.classList.remove('is-invalid');
            this.expenseCategoryInputElement.nextElementSibling.style.display = 'none';
        } else {
            this.expenseCategoryInputElement.classList.add('is-invalid');
            this.expenseCategoryInputElement.nextElementSibling.style.display = 'block';
            isValid = false;
        }

        this.validateForm(isValid);
    }

    validateForm(isValid) {
        if (isValid) {
            this.expenseCategoryButtonElement.removeAttribute('disabled');
        } else {
            this.expenseCategoryButtonElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async createExpenseCategory(title) {
        if(title) {
            const result = await HttpUtils.request('/categories/expense', 'POST', true, {
                title
            });

            if (result.error || !result.response) {
                console.log('Ошибка создания категории');
                return;
            }
            location.href = '#/expenses'
        }
        else {
            console.log('Some error with input value');
        }
    }
}
import {UrlManager} from "../../utils/url-manager";
import {HttpUtils} from "../../utils/http-utils";

export class UpdateExpenseCategory {
    constructor() {
        const that = this;
        this.routeParams = UrlManager.getQueryParams();
        this.expenseCategoryInputElement = document.getElementById('expenseCategory');
        this.expenseCategoryButtonElement = document.getElementById('updateCategory');

        const id = this.routeParams.id;
        if(!id) {
            location.href = '#/expenses'
        }

        this.getCategory(id).then();

        this.expenseCategoryButtonElement.onclick = () => {
            that.updateExpenseCategory(id, this.expenseCategoryInputElement.value);
        }
        this.expenseCategoryInputElement.oninput = () => {
            that.validateField.call(that, this.expenseCategoryInputElement, this);
        }
    }

    async getCategory(id) {
        const result = await HttpUtils.request('/categories/expense/' + id, 'GET', true);

        if (result.error || !result.response) {
            console.log('Ошибка получения id категории');
            return;
        }
        this.expenseCategoryInputElement.value = result.response.title;
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

    async updateExpenseCategory(id, title) {
        if(title) {
            const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, {
                title
            });

            if (result.error || !result.response) {
                console.log('Ошибка обновления категории');
                return;
            }
            location.href = '#/expenses';
        }
        else {
            console.log('Some error with input value');
        }
    }
}
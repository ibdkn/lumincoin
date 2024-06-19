import {HttpUtils} from "../../utils/http-utils";
import {UrlManager} from "../../utils/url-manager";

export class UpdateIncomeCategory {
    constructor() {
        const that = this;
        this.routeParams = UrlManager.getQueryParams();
        this.incomeCategoryInputElement = document.getElementById('incomeCategory');
        this.incomeCategoryButtonElement = document.getElementById('updateCategory');

        const id = this.routeParams.id;
        if(!id) {
            location.href = '#/income'
        }

        this.getCategory(id).then();

        this.incomeCategoryButtonElement.onclick = () => {
            that.updateIncomeCategory(id, this.incomeCategoryInputElement.value);
        }
        this.incomeCategoryInputElement.oninput = () => {
            that.validateField.call(that, this.incomeCategoryInputElement, this);
        }
    }

    async getCategory(id) {
        const result = await HttpUtils.request('/categories/income/' + id, 'GET', true);

        if (result.error || !result.response) {
            console.log('Ошибка получения id категории');
            return;
        }
        this.incomeCategoryInputElement.value = result.response.title;
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

    async updateIncomeCategory(id, title) {
        if(title) {
            const result = await HttpUtils.request('/categories/income/' + id, 'PUT', true, {
                title
            });

            if (result.error || !result.response) {
                console.log('Ошибка обновления категории');
                return;
            }
            location.href = '#/income';
        }
        else {
            console.log('Some error with input value');
        }
    }
}

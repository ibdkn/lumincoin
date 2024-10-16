import { UrlManager } from "../../utils/url-manager";
import { HttpUtils } from "../../utils/http-utils";
import {Balance} from "../balance/balance";

export class UpdateOperation {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        const id = this.routeParams.id;
        if (!id) {
            location.href = '#/budget';
        }

        this.operation = {};
        this.categories = [];

        this.allInputElements = document.querySelectorAll('.form-control');

        this.selectCategoryTypeElement = document.getElementById('category-type');
        this.selectCategoryElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
        this.updateButtonElement = document.getElementById('updateCategory');

        this.allInputElements.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
        });

        this.getOperation(id).then();

        this.updateButtonElement.addEventListener('click', () => this.updateOperationRecords(id));
    }

    validateField(element) {
        let isValid = true;

        if (element.id !== 'comment' && !element.value) {
            element.classList.add('is-invalid');
            element.nextElementSibling.style.display = 'block';
            isValid = false;
        }

        this.validateForm();
    }

    validateForm() {
        const isValid = Array.from(this.allInputElements)
            .filter(input => input.id !== 'comment')
            .every(input => input.value);

        if (isValid) {
            this.updateButtonElement.removeAttribute('disabled');
        } else {
            this.updateButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    async getOperation(id) {
        if (id) {
            const result = await HttpUtils.request('/operations/' + id, 'GET', true);

            if (result.error || !result.response) {
                console.log('Ошибка получения id операции');
                return;
            }

            this.operation = result.response;
        }
        this.showRecords();
    }

    async getCategories(category) {
        if (category) {
            const result = await HttpUtils.request('/categories/' + category, 'GET', true);

            if (result.error || !result.response) {
                console.log('Ошибка получения категорий');
                return;
            }

            this.categories = result.response;
            this.showCategories();
        }
    }

    showCategories() {
        this.selectCategoryElement.innerHTML = '';

        if (this.categories && this.categories.length > 0) {
            this.categories.forEach(category => {
                const optionCategoryElement = document.createElement('option');
                optionCategoryElement.value = category.title;
                optionCategoryElement.dataset.id = category.id;
                optionCategoryElement.innerText = category.title;

                this.selectCategoryElement.appendChild(optionCategoryElement);
            });
        }
    }

    async showRecords() {
        const operation = this.operation;
        if (operation) {
            this.selectCategoryTypeElement.value = operation.type;

            await this.getCategories(operation.type);

            this.selectCategoryElement.value = operation.category;
            this.amountInputElement.value = operation.amount;
            this.dateInputElement.value = operation.date;
            this.commentInputElement.value = operation.comment;
        }

        this.selectCategoryTypeElement.onchange = async () => {
            await this.getCategories(this.selectCategoryTypeElement.value);
        };
    }

    async updateOperationRecords(id) {
        const categoryID = +this.selectCategoryElement.options[this.selectCategoryElement.selectedIndex].dataset.id;
        const type = this.selectCategoryTypeElement.value;
        const amount = +this.amountInputElement.value;
        const date = this.dateInputElement.value;
        const comment = this.commentInputElement.value || ' ';

        if (id) {
            const result = await HttpUtils.request('/operations/' + id, 'PUT', true, {
                category_id: categoryID,
                type,
                amount,
                date,
                comment
            });

            if (result.error || !result.response) {
                console.log('Ошибка редактирования категории');
                return;
            }
            Balance.updateBalance;
            location.href = '#/budget';
        }
    }
}
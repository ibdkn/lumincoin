import {UrlManager} from "../../utils/url-manager";
import {HttpUtils} from "../../utils/http-utils";

export class CreateOperation {
    constructor() {
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

        this.showRecords().then();

        this.updateButtonElement.addEventListener('click', () => this.createOperationRecords());
    }

    validateField(element) {
        let isValid = true;

        if (element.id !== 'comment' && !element.value) {
            element.classList.add('is-invalid');
            element.nextElementSibling.style.display = 'block';
            isValid = false;
        } else {
            element.classList.remove('is-invalid');
            element.nextElementSibling.style.display = 'none';
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
        const type = this.selectCategoryTypeElement.value;

        await this.getCategories(type);

        this.selectCategoryTypeElement.onchange = async () => {
            await this.getCategories(this.selectCategoryTypeElement.value);
        };
    }

    async createOperationRecords() {
        const categoryID = +this.selectCategoryElement.options[this.selectCategoryElement.selectedIndex].dataset.id;
        const type = this.selectCategoryTypeElement.value;
        const amount = +this.amountInputElement.value;
        const date = this.dateInputElement.value;
        const comment = this.commentInputElement.value || ' ';

        const result = await HttpUtils.request('/operations', 'POST', true, {
            category_id: categoryID,
            type,
            amount,
            date,
            comment
        });

        if (result.error || !result.response) {
            console.log('Ошибка создания категории');
            return;
        }
        location.href = '#/budget';
    }
}
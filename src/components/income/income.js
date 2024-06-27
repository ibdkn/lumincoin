import {HttpUtils} from "../../utils/http-utils";
import {Budget} from "../budget/budget";
import {Balance} from "../balance/balance";

export class Income {
    constructor() {
        this.income = [];
        this.allOperations = [];
        this.getIncome().then();
        this.getAllOperations().then();
    }

    async getIncome() {
        const result = await HttpUtils.request('/categories/income', 'GET', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }
        this.income = result.response;
        this.showIncomeCategories();
    }

    showIncomeCategories() {
        const cardsElement = document.getElementById('common-cards');
        const newCategoryElement = document.createElement('a');
        newCategoryElement.setAttribute('href', '#/income/create-income-category');
        newCategoryElement.className = 'card common-card new-card';
        newCategoryElement.innerText = '+';

        cardsElement.innerHTML = '';

        if (this.income && this.income.length > 0) {
            const that = this;
            this.income.forEach(income => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card common-card';
                cardElement.setAttribute('data-id', income.id);


                const cardBodyElement = document.createElement('div');
                cardBodyElement.className = 'card-body';

                const cardTitleElement = document.createElement('div');
                cardTitleElement.className = 'card-title';
                cardTitleElement.innerText = income.title;

                const cardAnchorButtonElement = document.createElement('a');
                cardAnchorButtonElement.setAttribute('href', '#/income/update-income-category?id=' + income.id);
                cardAnchorButtonElement.className = 'button button-accent';
                cardAnchorButtonElement.innerText = 'Редактировать';

                const cardDeleteButtonElement = document.createElement('button');
                cardDeleteButtonElement.className = 'button button-danger';
                cardDeleteButtonElement.innerText = 'Удалить';

                cardBodyElement.appendChild(cardTitleElement);
                cardBodyElement.appendChild(cardAnchorButtonElement);
                cardBodyElement.appendChild(cardDeleteButtonElement);

                cardElement.appendChild(cardBodyElement);
                cardsElement.appendChild(cardElement);

                cardDeleteButtonElement.addEventListener('click', function ()  {
                    const deleteCategoryButton = document.getElementById('delete');
                    document.getElementById('popup').style.display = 'block';

                    deleteCategoryButton.onclick = function () {
                        that.deleteIncomeCategory(income.id, income.title);
                        document.getElementById('popup').style.display = 'none';
                    }
                })
            })
        }

        cardsElement.appendChild(newCategoryElement);
    }

    async getAllOperations() {
        const result = await HttpUtils.request('/operations/?period=all', 'GET', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.allOperations = result.response;
    }

    async deleteIncomeCategory(id, title) {
        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.income = this.income.filter(income => income.id !== id);

        this.allOperations.forEach(operation => {
            if(operation.category === title) {
                this.deleteRelativeOperations(operation.id);
            }
        })

        const balanceInstance = new Balance();
        await balanceInstance.getBalance();
        this.showIncomeCategories();
    }

    async deleteRelativeOperations(id) {
        if(id) {
            const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

            if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
                console.log('Error data');
                return;
            }

            Balance.updateBalance;
        }
    }
}
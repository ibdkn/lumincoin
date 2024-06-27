import {HttpUtils} from "../../utils/http-utils";
import {Balance} from "../balance/balance";

export class Expenses {
    constructor() {
        this.expenses = [];
        this.allOperations = [];
        this.getExpenses().then();
        this.getAllOperations().then();
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense', 'GET', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }
        this.expenses = result.response;
        this.showExpensesCategories();
    }

    async showExpensesCategories(){
        const cardsElement = document.getElementById('common-cards');
        const newCategoryElement = document.createElement('a');
        newCategoryElement.setAttribute('href', '#/expenses/create-expense-category');
        newCategoryElement.className = 'card common-card new-card';
        newCategoryElement.innerText = '+';

        cardsElement.innerHTML = '';

        if (this.expenses && this.expenses.length > 0) {
            const that = this;
            this.expenses.forEach(expense => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card common-card';
                cardElement.setAttribute('data-id', expense.id);


                const cardBodyElement = document.createElement('div');
                cardBodyElement.className = 'card-body';

                const cardTitleElement = document.createElement('div');
                cardTitleElement.className = 'card-title';
                cardTitleElement.innerText = expense.title;

                const cardAnchorButtonElement = document.createElement('a');
                cardAnchorButtonElement.setAttribute('href', '#/expenses/update-expense-category?id=' + expense.id);
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
                    const closeCategoryButton = document.getElementById('close');
                    document.getElementById('popup').style.display = 'block';

                    deleteCategoryButton.onclick = function () {
                        that.deleteExpenseCategory(expense.id, expense.title);
                        document.getElementById('popup').style.display = 'none';
                    }

                    closeCategoryButton.onclick = function () {
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

    async deleteExpenseCategory(id, title) {
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.expenses = this.expenses.filter(expense => expense.id !== id);

        this.allOperations.forEach(operation => {
            if(operation.category === title) {
                this.deleteRelativeOperations(operation.id);
            }
        })

        const balanceInstance = new Balance();
        await balanceInstance.getBalance();
        this.showExpensesCategories();
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
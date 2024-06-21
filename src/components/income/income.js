import {HttpUtils} from "../../utils/http-utils";

export class Income {
    constructor() {
        this.income = [];
        this.getIncome().then();
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
                        that.deleteIncomeCategory(income.id);
                        document.getElementById('popup').style.display = 'none';
                    }
                })
            })
        }

        cardsElement.appendChild(newCategoryElement);
    }

    async deleteIncomeCategory(categoryID) {
        const result = await HttpUtils.request('/categories/income/' + categoryID, 'DELETE', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.income = this.income.filter(income => income.id !== categoryID);

        // location.href = '#/income';
        this.showIncomeCategories();
    }
}
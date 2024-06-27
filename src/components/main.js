import {HttpUtils} from "../utils/http-utils";
import { Chart, PieController, ArcElement, Tooltip, Legend, Colors } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend, Colors);

export class Main {
    constructor() {
        const that = this;
        this.allOperations = [];
        this.allButtons = document.querySelectorAll('.budget-period');
        this.intervalButtonElement = document.getElementById('interval');
        this.interval1 = document.getElementById('interval-1');
        this.interval2 = document.getElementById('interval-2');

        this.intervalButtonElement.onclick = function () {
            that.interval1.removeAttribute('disabled');
            that.interval2.removeAttribute('disabled');
        }

        const navButtons = document.getElementById('nav-buttons');

        navButtons.onclick = function (event) {
            let interval1,
                interval2;

            if(event.target.id !== 'interval') {
                that.interval1.setAttribute('disabled', 'disabled');
                that.interval2.setAttribute('disabled', 'disabled');
                that.getOperations(event.target.id);
            } else if(event.target.id === 'interval') {
                that.interval1.onchange = function () {
                    interval1 = this.value;
                }
                that.interval2.onchange = function () {
                    interval2 = this.value;

                    that.getIntervalOperations(interval1, interval2)
                }
            }

            that.addActiveClass(event.target);
        }

        that.getOperations().then();
    }

    addActiveClass(target) {
        this.allButtons.forEach(button => button.classList.remove('active'));
        target.classList.add('active');
    }

    async getOperations(period = 'all') {
        const result = await HttpUtils.request('/operations/?period=' + period, 'GET', true);

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.allOperations = result.response;
        this.getCount();
    }

    async getIntervalOperations(interval1, interval2) {
        if(interval1 && interval2) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + interval1 + '&dateTo=' + interval2, 'GET', true);

            if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
                console.log('Error data');
                return;
            }

            this.allOperations = result.response;
            this.getCount();
        }
    }

    getCount() {
        const that = this;
        const categoryIncomeArray = [];
        const categoryExpenseArray = [];

        if (this.allOperations && this.allOperations.length > 0) {

            this.allOperations.forEach(budget => {

                if (budget.type === 'income') {
                    categoryIncomeArray.push(budget);
                }
                if (budget.type === 'expense') {
                    categoryExpenseArray.push(budget);
                }
            })
        }

        const expensesByCategory = categoryExpenseArray.reduce((result, elem) => {
            result[elem.category]
                ? result[elem.category] = result[elem.category] + elem.amount
                : result[elem.category] = elem.amount
            return result;
        }, {})

        const incomeByCategory = categoryIncomeArray.reduce((result, elem) => {
            result[elem.category]
                ? result[elem.category] = result[elem.category] + elem.amount
                : result[elem.category] = elem.amount
            return result;
        }, {})
        console.log(expensesByCategory)
        this.getIncomeChart(incomeByCategory);
        this.getExpensesChart(expensesByCategory);
    }

    getIncomeChart(incomeByCategory) {
        console.log(incomeByCategory)
        const incomeHelp = document.getElementById('income-help');

        if (!Object.keys(incomeByCategory).length) {
            incomeHelp.style.display = 'block';
        } else {
            incomeHelp.style.display = 'none';
        }

        if (this.one) {
            this.one.destroy();
        }

        let category = [];
        let amount = [];

        const incomeCategory = JSON.stringify(incomeByCategory);

        JSON.parse(incomeCategory, (key, value) => {
            if (key) {
                category.push(key);
            }
            if (typeof value === 'number') {
                amount.push(value);
            }
        });

        const chartIncome = document.getElementById('chartIncome');

        this.one = new Chart(chartIncome, {
            type: 'doughnut',
            data: {
                labels: category,
                datasets: [{
                    label: 'Доходы',
                    data: amount,
                    borderWidth: 1
                }]
            },
            plugins: {
                colors: {
                    enabled: false
                }
            }
        });
    }

    getExpensesChart(expensesByCategory) {
        const expenseHelp = document.getElementById('expense-help');

        if (!Object.keys(expensesByCategory).length) {
            expenseHelp.style.display = 'block';
        } else {
            expenseHelp.style.display = 'none';
        }

        if (this.two) {
            this.two.destroy();
        }

        let category = [];
        let amount = [];

        const expensesCategory = JSON.stringify(expensesByCategory);

        JSON.parse(expensesCategory, (key, value) => {
            if (key) {
                category.push(key);
            }
            if (typeof value === 'number') {
                amount.push(value);
            }
        });

        const chartExpense = document.getElementById('chartExpense');

        this.two = new Chart(chartExpense, {
            type: 'doughnut',
            data: {
                labels: category,
                datasets: [{
                    label: 'Расходы',
                    data: amount,
                    borderWidth: 1
                }]
            },
            plugins: {
                colors: {
                    enabled: false
                }
            }
        });
    }
}
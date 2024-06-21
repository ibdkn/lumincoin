import {HttpUtils} from "../../utils/http-utils";

export class Budget {
    constructor() {
        const that = this;
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

        that.getOperations('all').then();
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

        console.log(result.response)
        this.showRecords(result.response)
    }

    async getIntervalOperations(interval1, interval2) {
        if(interval1 && interval2) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + interval1 + '&dateTo=' + interval2, 'GET', true);

            if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
                console.log('Error data');
                return;
            }

            this.showRecords(result.response)
        }
    }

    showRecords(operations) {
        const that = this;
        const tableElement = document.getElementById('table');
        const records = document.getElementById('records');
        records.innerHTML = '';
        document.getElementById('isTableEmpty').style.display = 'none';

        if (operations && operations.length > 0) {
            tableElement.style.visibility = 'visible';

            operations.forEach((operation, index) => {
                const tableBodyElement = document.createElement('tr');
                tableBodyElement.className = 'table-body';

                const indexTableElement = document.createElement('td');
                // indexTableElement.setAttribute('data-id', operation.id);
                indexTableElement.className = 'index';
                indexTableElement.innerText = index + 1;

                const categoryTypeTableElement = document.createElement('td');

                if(operation.type === 'income') {
                    categoryTypeTableElement.className = 'category-type income';
                    categoryTypeTableElement.innerText = 'Доход';
                } else if(operation.type === 'expense') {
                    categoryTypeTableElement.className = 'category-type expense';
                    categoryTypeTableElement.innerText = 'Расход';
                }

                const categoryTableElement = document.createElement('td');
                categoryTableElement.className = 'category';
                categoryTableElement.innerText = operation.category;

                const amountTableElement = document.createElement('td');
                amountTableElement.className = 'amount';
                amountTableElement.innerText = operation.amount + '$';

                const dateTableElement = document.createElement('td');
                dateTableElement.className = 'date';
                dateTableElement.innerText = operation.date;

                const commentTableElement = document.createElement('td');
                commentTableElement.className = 'comment';
                commentTableElement.innerText = operation.comment;

                const actionsTableElement = document.createElement('td');
                actionsTableElement.className = 'table-actions';

                const iconDeleteElement = document.createElement('a');
                iconDeleteElement.className = 'icon-btn delete-category';
                iconDeleteElement.innerHTML = `
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="white"/>
                                <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="white"/>
                                <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="white"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="white"/>
                            </svg>
                `

                const iconUpdateElement = document.createElement('a');
                iconUpdateElement.className = 'icon-btn update-category';
                iconUpdateElement.setAttribute('href', '#/budget/update-operation?id=' + operation.id)
                iconUpdateElement.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="white"/>
                            </svg>
                `

                iconDeleteElement.onclick = function () {
                    const deleteCategoryButton = document.getElementById('delete');
                    const closeCategoryButton = document.getElementById('close');
                    document.getElementById('popup').style.display = 'block';

                    deleteCategoryButton.onclick = function () {
                        that.deleteCurrentCategory(operation.id);
                        document.getElementById('popup').style.display = 'none';
                    }

                    closeCategoryButton.onclick = function () {
                        document.getElementById('popup').style.display = 'none';
                    }
                }

                actionsTableElement.appendChild(iconDeleteElement);
                actionsTableElement.appendChild(iconUpdateElement);

                tableBodyElement.appendChild(indexTableElement);
                tableBodyElement.appendChild(categoryTypeTableElement);
                tableBodyElement.appendChild(categoryTableElement);
                tableBodyElement.appendChild(amountTableElement);
                tableBodyElement.appendChild(dateTableElement);
                tableBodyElement.appendChild(commentTableElement);
                tableBodyElement.appendChild(actionsTableElement);

                records.appendChild(tableBodyElement);
            })
        } else {
            document.getElementById('isTableEmpty').style.display = 'block';
            tableElement.style.visibility = 'hidden';
        }
    }

    async deleteCurrentCategory(id) {
        if(id) {
            const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

            if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
                console.log('Error data');
                return;
            }

            this.getOperations();
        }
    }
}
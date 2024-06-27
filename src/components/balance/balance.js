import {HttpUtils} from "../../utils/http-utils";

export class Balance {
    async getBalance() {
        const result = await HttpUtils.request('/balance', 'GET', true);
        if (result.error || !result.response) {
            console.log('Error data');
            return;
        }

        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.innerText = result.response.balance;
        }
    }
    async updateBalance() {
        const result = await HttpUtils.request('/balance', 'PUT', true);
        if (result.error || !result.response) {
            console.log('Error data');
            return;
        }
    }
}

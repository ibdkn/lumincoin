import {HttpUtils} from "../../utils/http-utils";

export class Income {
    constructor() {

        this.getIncome().then();
    }

    async getIncome() {
        const result = await HttpUtils.request('/categories/income');

        if (result.error || !result.response || (result.response && (result.response.error || result.response.length < 0))) {
            console.log('Error data');
            return;
        }

        this.showRecords(result.response);
    }

    showRecords(income) {
        console.log(income)
    }
}
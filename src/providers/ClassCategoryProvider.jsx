import axios from 'axios';
import _ from 'lodash';
export default () => {
    const apiUrl = "/class_category"

    const axiosClient = (method, url, params) => {
        let payload = {
            method: method,
            url: url,
        }
        if (params && Object.keys(params).length > 0) {
            if (method == "GET") {
                payload.params = params
            } else {
                payload.data = params
            }
        }
        return axios(payload);
    }
    return {

        get: (params = {}) => {
            let url = `${apiUrl}`;
            return axiosClient("GET", url, params)
            .then(({ data }) => {
                return data;
            });
        }
    };
};

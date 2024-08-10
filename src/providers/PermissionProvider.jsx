import axios from 'axios';
import _ from 'lodash';
export default () => {
    const apiUrl = "/permission"
    
    const axiosClient = (method, url, params) => {
        let payload = {
            method: method,
            url: url,
        }
        if (!_.isEmpty(params)) {
            if (method == "GET") {
                payload.params = params
            } else {
                payload.data = params
            }
        }
        return axios(payload);
    }
    return {

        getPermissionsList: (params = {}) => {
            let url = `${apiUrl}/permission-list`;
            return axiosClient("GET", url, params)
            .then(({ data }) => {
                return data;
            });
        },
    };
};
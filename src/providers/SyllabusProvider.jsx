import axios from 'axios';
import _ from 'lodash';
export default () => {
    const apiUrl = "/syllabus"

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
        },

        create: (params) => {
            const url = `${apiUrl}  `;
            return axios.post(url, params)
                .then(({ data }) => {
                    return data;
                });
        },

        update: (params) => {
            const url = `${apiUrl}`+`/${params.id}`;
            delete params.id;
            return axiosClient("PUT", url, params).then(({ data }) => {
                return data;
            });
        },

        delete: (params) => {
            const url = `${apiUrl}/${params.id}`
            return axiosClient('DELETE', url, params).then(({ data }) => {
                return data
            })
        },
    };
};

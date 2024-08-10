import axios from 'axios';
import _ from 'lodash';

export default () => {
    const apiUrl = "/user-settings"

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

        update: (params) => {
            const url = `${apiUrl}`

            return axios.post(url, params)
                .then(({data}) => {
                    return data;
                })
        },

        forgot: (params) => {
            const url = `/forgot-password`;
            return axiosClient("POST", url, params)
                .then(({ data }) => {
                    return {
                        success: true
                    };
                });
        },

        reset: (params) => {
            const url = `/reset-password`;
            return axiosClient("POST", url, params)
                .then(({ data }) => {
                    return {
                        success: true
                    };
                });
        },

        logout: () => {
            const url = `/logout`;
            return axiosClient("GET", url, "")
                .then(resp => {
                    // success
                    window.location.reload();
                }, (error) => {
                    window.location = "/";
                })
        },

    };
};

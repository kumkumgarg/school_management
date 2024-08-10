import axios from 'axios';

export default () => {
    const apiUrl = "/settings"

    const axiosClient = (method, url, params) => {

        let payload = {
            method: method,
            url: url,

        }
        if (params) {
            payload[method === "GET" ? 'params' : 'data'] = params;
        }

        return axios(payload)
    }

    return {
        get: (params) => {
            let url = `${apiUrl}`;
            return axiosClient("GET", url, params)
                .then(({ data }) => {
                    return data;
                });
        },

        update: (params) => {
            const url = `${apiUrl}`

            return axios.post(url, params)
                .then(({ data }) => {
                    return data;
                });
        },

        getSettingList: (params) => {
            const url = `${apiUrl}/setting-list`;

            return axiosClient("GET", url, params).then(({ data }) => {
                return data;
            });
        },

        getSettings: (params = {}) => {
            let url = `${apiUrl}/get_settings`
            return axiosClient("GET", url, params)
                .then(({ data }) => {
                    return data;
                });
        },

        saveSetting: (params) => {
            const url = `${apiUrl}/save_setting`;
            return axios.post(url, params)
                .then(({ data }) => {
                    return data;
                });
        }
    };
};

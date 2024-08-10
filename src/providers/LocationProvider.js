import axios from 'axios';

export default () => {
    const apiUrl = "/location"
    const axiosClient = (method, url, params) => {

        let payload = {
            method: method,
            url: url,

        }
        if(params) {

            if(method == "GET") {
                payload.params = params
            } else {
                payload.data = params
            }
        }

        return axios(payload);
    }

    return {

        get: (params = "") => {
            let url = `${apiUrl}`;
            if(params && 'id' in params) {
                url +="/"+params.id
                delete params.id;
            }
            return axiosClient("GET", url, params)
            .then(({ data }) => {
                return data;
            });
        },

        create: (params) => {
            const url = `${apiUrl}`;
            return axiosClient("POST", url, params).then(({ data }) => {

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

        patch: (id) => {
            const url = `${apiUrl}/${id}`;
            return axiosClient("PATCH", url, "").then(({ data }) => {
                return data;
            });
        },

        delete: (id) => {
            const url = `${apiUrl}/${id}`;
            return axiosClient("DELETE", url, "").then(({ data }) => {

                return {
                    success: true
                };
            });
        },
    };
};

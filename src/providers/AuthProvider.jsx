import axios from 'axios';
import sessionAuthManager from "../helpers/sessionAuthManager";

export default () => {
    const apiUrl = "/"
    const axiosClient = (method, url, params) => {
        
        let payload = {
            method: method,
            url: url,
           
        }
        // if(!_.isEmpty(params)) {
        if(Object.keys(params).length > 0) {

            if(method == "GET") {
                payload.params = params
            } else {
                payload.data = params
            }
        }
        
        return axios(payload);
    }

    return {
        login: (params) => {
            const url = `/login`;
            return axiosClient("POST", url,params)
            .then(({ data }) => {
                sessionAuthManager.setAuth(data.authenticated)
                return data;
            });
        },

        logout: () => {
            const url = `${apiUrl}/logout`;
            return axiosClient("GET", url,"")
            .then(resp => {
                // success 
                window.location.reload();
            }, (error) => {
                window.location = "/";
            })
        },

    };
};
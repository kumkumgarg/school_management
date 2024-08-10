import axios from 'axios'

export default () => {
    const apiUrl = '/staff-data'
    const axiosClient = (method, url, params) => {
        let payload = {
            method: method,
            url: url,
        }
        // if(!_.isEmpty(params)) {
        if (params && Object.keys(params).length > 0) {
            if (method == 'GET') {
                payload.params = params
            } else {
                payload.data = params
            }
        }

        return axios(payload)
    }

    return {
        create: (params) => {
            const url = `${apiUrl}`
            return axiosClient('POST', url, params).then(({ data }) => {
                return data
            })
        },
        update: (params) => {
            const url = `${apiUrl}/${params.id}`
            return axiosClient('PUT', url, params).then(({ data }) => {
                return data
            })
        },
        details: (params) => {
            const url = `${apiUrl}/${params.id}`
            return axiosClient('GET', url, params).then(({ data }) => {
                return data
            })
        },
        staffList: (params) => {
            const url = `${apiUrl}`
            return axiosClient('GET', url, params).then(({ data }) => {
                return data
            })
        },
        delete: (params) => {
            const url = `${apiUrl}/${params.id}`
            return axiosClient('DELETE', url, params).then(({ data }) => {
                return data
            })
        },
        patch: (params) => {
            const url = `${apiUrl}/${params.id}`
            return axiosClient('PATCH', url, params).then(({ data }) => {
                return data
            })
        },

    }
}

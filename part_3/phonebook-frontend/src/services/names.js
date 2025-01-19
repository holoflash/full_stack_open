import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios
        .get(baseUrl)
        .then((response) => {
            return response.data;
        })
        .catch(error => {
            return error
        })
};

const create = newObject => {
    return axios
        .post(baseUrl, newObject)
        .then((response) => {
            return response.data;
        })
        .catch(error => {
            return error
        })
}

const deleteNameFromServer = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            return error
        })
}

const update = (id, newObject) => {
    return axios
        .put(`${baseUrl}/${id}`, newObject)
        .then((response) => {
            console.log(response)
            return response.data
        })
        .catch(error => {
            return error
        })
}

export default { getAll, create, update, deleteNameFromServer }
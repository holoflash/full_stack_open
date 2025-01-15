import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios
        .get(baseUrl)
        .then((response) => {
            return response.data;
        });
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteNameFromServer = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then((response) => {
            return response.data
        })
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, update, deleteNameFromServer }
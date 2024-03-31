import axios from "axios";

const jurnalApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URLPROD
})

const jurnalEndpoint = "/api/jurnal"

const getJurnal = async (token) => {
    try {
        const response = await jurnalApi.get(jurnalEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

const addJurnal = async (token, data) => {
    try {
        const response = await axios.post(`${jurnalEndpoint}/add`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        console.log('Form submitted successfully');
        router.push('/dashboard');
    } catch (error) {
        console.error('Error submitting form:', error.message);
    }
}

const viewJurnal = async (token, id) => {
    try {
        const response = await jurnalApi.get(`${jurnalEndpoint}/view/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

const editJurnal = async (token, id) => {
    try {
        const response = await jurnalApi.get(`${jurnalEndpoint}/edit/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

const deleteJurnal = async (token, id) => {
    try {
        const response = await jurnalApi.get(`${jurnalEndpoint}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

module.exports = {
    getJurnal,
    addJurnal,
    viewJurnal,
    editJurnal,
    deleteJurnal
}
'use client'


import useSWR from 'swr';
import axios from 'axios';

const fetchData = async (token, endpoint) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URLPROD}/api/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchDataById = async (token, endpoint, id) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URLPROD}/api/${endpoint}/view/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const countByVoucher = (data) => {
    if (!Array.isArray(data.data)) {
        return {};
    }

    return data.data.reduce((accumulator, currentItem) => {
        if (!accumulator['semua']) {
            accumulator['semua'] = 0;
        }
        accumulator['semua']++;

        if (!accumulator[currentItem.voucher]) {
            accumulator[currentItem.voucher] = 0;
        }
        accumulator[currentItem.voucher]++;

        return accumulator;
    }, {});
};

function useFetchData(token, endpoint) {
    const { data, error } = useSWR(token ? endpoint : null, () => fetchData(token, endpoint));
    if(endpoint == 'jurnal'){
        const count = countByVoucher(data || []);
        
        return {
            data,
            count,
            error,
            isLoading: !data && !error
        };
    }
    
    return {
        data,
        error,
        isLoading: !data && !error
    };
}

function useFetchDataById(token, endpoint, id) {
    const { data, error } = useSWR(token ? endpoint : null, () => fetchDataById(token, endpoint, id));

    return {
        data,
        error,
        isLoading: !data && !error
    };
}

module.exports = {
    useFetchData,
    useFetchDataById
}

import api from './api';

const addressService = {
    getAddresses: async () => {
        const { data } = await api.get('/addresses');
        return data;
    },

    addAddress: async (addressData) => {
        const { data } = await api.post('/addresses', addressData);
        return data;
    },

    updateAddress: async (addressId, addressData) => {
        const { data } = await api.put(`/addresses/${addressId}`, addressData);
        return data;
    },

    deleteAddress: async (addressId) => {
        const { data } = await api.delete(`/addresses/${addressId}`);
        return data;
    },

    setDefaultAddress: async (addressId) => {
        const { data } = await api.put(`/addresses/${addressId}/default`);
        return data;
    },
};

export default addressService;
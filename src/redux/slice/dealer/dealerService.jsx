import api from "../../axiosconfig";

const createDealer = async (data) => {
    const res = await api.post("/dealer/createDealer", data);
    return res.data;
};

const getAllDealer = async (payload) => {
    const { search = "", state = "", city = "", distributorId = "", limit = 10, page = 1 ,isActive } = payload;

    const res = await api.get("/dealer/getDealers", {
        params: { search, limit, page, state, city, distributorId , isActive },
    });
    return res.data;
};

const getDealerById = async (payload) => {
    const { dealerId } = payload;
    const res = await api.get("/dealer/getDealer", {
        params: { dealerId },
    });
    return res.data;
};

const getDealerDropdown = async () => {
    const res = await api.get("/dealer/getDealersDropdown");
    return res.data;
};

const updateDealer = async (dealerId, data) => {
    const res = await api.put(
        `/dealer/updateDealer/${dealerId}`, data);
    return res.data;
};

const deleteDealer = async (dealerId) => {
    const res = await api.put(`/dealer/deleteDealer/${dealerId}`);
    return res.data;
};

const restoreDealer = async (dealerId) => {
    const res = await api.put(`/dealer/restoreDealer/${dealerId}`);
    return res.data;
};

const dealerService = {
    createDealer,
    getAllDealer,
    getDealerById,
    getDealerDropdown,
    updateDealer,
    deleteDealer,
    restoreDealer
};

export default dealerService;
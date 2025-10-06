import api from "../../axiosconfig";

const createDealer = async (data) => {
    const res = await api.post("/dealer/createDealer", data);
    return res.data;
};

const getAllDealer = async (payload) => {
    const { search = "", limit = 10, page = 1 } = payload;

    const res = await api.get("/dealer/getDealers", {
        params: { search, limit, page },
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

const dealerService = {
    createDealer,
    getAllDealer,
    getDealerById,
    getDealerDropdown,
};

export default dealerService;
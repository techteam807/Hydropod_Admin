import api from "../../axiosconfig";

const createDistributor = async (data) => {
    const res = await api.post("/distributor/createDistributor", data);
    return res.data;
};

const getAllDistributor = async (payload) => {
    const { search = "", state = "", city = "", limit = 10, page = 1 } = payload;

    const res = await api.get("/distributor/getDistributors", {
        params: { search, state, city, limit, page },
    });
    return res.data;
};

const getDistributorById = async (payload) => {
    const { distributorId } = payload;

    const res = await api.get("/distributor/getDistributor", {
        params: { distributorId },
    });
    return res.data;
};

const getDistributorDropdown = async () => {

    const res = await api.get("/distributor/getDistributors");
    return res.data;
};

const updateDistributor = async (distributorId, data) => {
    const res = await api.put(
        `/distributor/updateDistributor/${distributorId}`, data);
    return res.data;
};

const deleteDistributor = async (distributorId) => {
    const res = await api.put(`/distributor/deleteDistributor/${distributorId}`);
    return res.data;
};

const distributorService = {
    createDistributor,
    getAllDistributor,
    getDistributorById,
    getDistributorDropdown,
    updateDistributor,
    deleteDistributor
};

export default distributorService;
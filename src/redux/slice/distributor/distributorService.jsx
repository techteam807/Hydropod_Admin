import api from "../../axiosconfig";

const createDistributor = async (data) => {
    const res = await api.post("/distributor/createDistributor", data);
    return res.data;
};

const getAllDistributor = async (payload) => {
    const { search = "", limit = 10, page = 1 } = payload;

    const res = await api.get("/distributor/getDistributors", {
        params: { search, limit, page },
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

const distributorService = {
    createDistributor,
    getAllDistributor,
    getDistributorById,
    getDistributorDropdown,
};

export default distributorService;
import api from "../../axiosconfig";

const createTechnician = async (data) => {
    const res = await api.post("/user/createTechnicianUsers", data);
    return res.data;
};

const getAllTechnician = async (payload) => {
    const { search = "", limit = 10, page = 1, userParentType = "", userParentId = "" } = payload;

    const res = await api.get("/user/getTechnicians", {
        params: { search, limit, page, userParentType, userParentId },
    });
    return res.data;
};

const getCount = async () => {
    const res = await api.get("/user/userCount",);
    return res.data;
}


const technicianService = {
    createTechnician,
    getAllTechnician,
    getCount
};

export default technicianService;
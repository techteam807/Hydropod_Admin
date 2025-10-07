import api from "../../axiosconfig";

const createTechnician = async (data) => {
    const res = await api.post("/user/createTechnicianUsers", data);
    return res.data;
};

const getAllTechnician = async (payload) => {
    const { search = "", limit = 10, page = 1 } = payload;

    const res = await api.get("/user/getAllUsers", {
        params: { search, limit, page },
    });
    return res.data;
};


const technicianService = {
    createTechnician,
    getAllTechnician,
};

export default technicianService;
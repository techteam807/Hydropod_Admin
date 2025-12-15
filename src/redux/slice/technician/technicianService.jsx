import api from "../../axiosconfig";

/* ✅ DEFINE FIRST */
const getTechnicianDropdown = async (parentType, parentId) => {
  const res = await api.get("/user/getTechnicianDropDown", {
    params: {
      parentType,
      parentId,
    },
  });
  return res.data;
};

const createTechnician = async (data) => {
  const res = await api.post("/user/createTechnicianUsers", data);
  return res.data;
};

const getAllTechnician = async (payload = {}) => {
  const {
    search = "",
    limit = 10,
    page = 1,
    userParentType = "",
    userParentId = "",
    technicianId = "",
    isActive,
  } = payload;

  const res = await api.get("/user/getTechnicians", {
    params: {
      search: search.trim(),
      limit,
      page,
      userParentType,
      userParentId,
      technicianId,
      isActive,
    },
  });

  return res.data;
};

const getCount = async () => {
  const res = await api.get("/user/userCount");
  return res.data;
};

const updateTechnician = async (technicianId, data) => {
  const res = await api.put(`/user/updateTechnician/${technicianId}`, data);
  return res.data;
};

const deleteTechnician = async (technicianId) => {
  const res = await api.put(`/user/deleteTechnician/${technicianId}`);
  return res.data;
};

const restoreTechnician = async (technicianId) => {
  const res = await api.put(`/user/restoreTechnician/${technicianId}`);
  return res.data;
};

/* ✅ EXPORT LAST */
const technicianService = {
  createTechnician,
  getAllTechnician,
  getCount,
  updateTechnician,
  deleteTechnician,
  restoreTechnician,
  getTechnicianDropdown,
};

export default technicianService;
import api from "../../axiosconfig";

const createBanner = async (data) => {
    const res = await api.post("/banner/createBanner", data);
    return res.data;
};

const getBanners = async () => {
    const res = await api.get("/banner/getBanners");
    return res.data;
}

const updateBanner = async(bannerId, data) => {
    const res = await api.put(`/banner/updateBanner/${bannerId}`, data);
    return res.data;
}

const deleteBanner = async(bannerId) => {
    console.log("id:",bannerId);
    const res = await api.delete(`/banner/deleteBanner/${bannerId}`);
    return res.data;
}

const bannerService = {
    createBanner,
    getBanners,
    updateBanner,
    deleteBanner
};

export default bannerService;
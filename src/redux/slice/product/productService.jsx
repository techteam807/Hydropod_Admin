import api from "../../axiosconfig";

const getProduct = async (payload) => {
  const {
    search = "",
    limit = 10,
    page = 1,
    isApproved,
    state = "",
    city = "",
  } = payload;

  const res = await api.get(
    "/productInstallation/listProductInstallations",
    {
      params: {
        search: search.trim(),
        limit,
        page,
        isApproved,
        state: state.trim(),
        city: city.trim(),
      },
    }
  );

  return res.data;
};

const approveProduct = async (_id, data) => {
  const res = await api.put(
    `/productInstallation/approveInstallation/${_id}`,
    data
  );
  return res.data;
};

const productService = {
  getProduct,
  approveProduct,
};

export default productService;

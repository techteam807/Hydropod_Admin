import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Space,
  Tag,
  Tabs,
  Modal,
  Image,
  message,
  Spin,
  Empty,
} from "antd";
import Icons from "../../assets/icon";
import CustomTable from "../../component/commonComponent/CustomTable";
import { useDispatch, useSelector } from "react-redux";

import {
  approveProducts,
  getProducts,
} from "../../redux/slice/product/productSlice";
import { useSearchParams } from "react-router-dom";
import CustomInput from "../../component/commonComponent/CustomInput";
import { statesAndCities } from "../../constants/cities";

import {
  getTechnicianDropdown,
} from "../../redux/slice/technician/technicianSlice";
import { getDistributorDropdown } from "../../redux/slice/distributor/distributorSlice";
import { getDealerDropdown } from "../../redux/slice/dealer/dealerSlice";
const ViewProductInstallation = () => {

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();


  const { technicianDropdown = [], dropdownLoading = false } = useSelector(
    (state) => state.technician
  );

  console.log("technicianDropdown",technicianDropdown);
  
  const { distributorDrop = [] } = useSelector((state) => state.distributor);
  const { dealerDrop = [] } = useSelector((state) => state.dealer);
  const { Search } = Input;
  const { TabPane } = Tabs;
  const {
    // approveProduct,
    // unapproveProduct,
    product,
    loading,
    approveLoading,
    pagination,
  } = useSelector((state) => state.product);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("unapprove");
  const [approvePage, setApprovePage] = useState(1);
  const [unapprovePage, setUnapprovePage] = useState(1);
  const [approveModal, setApproveModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log("sel:", selectedItem);// get logged-in user
  const [imagePreview, setImagePreview] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");


  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    userParentType: "",
    userParentId: "",
    technicianId: "",
    limit: parseInt(searchParams.get("limit")) || 10,
  });
  const [parentDropdownOptions, setParentDropdownOptions] = useState([]);



  // Fetch distributor and dealer dropdowns on component mount
  useEffect(() => {
    dispatch(getDistributorDropdown());
    dispatch(getDealerDropdown());
  }, [dispatch]);




  // Fetch technician dropdown whenever userParentType / userParentId changes
  useEffect(() => {
    // if (filter.userParentType) {
    //   const parentId = filter.userParentType === "admin" ? user?._id : filter.userParentId;
    //   if (parentId) {
    //     dispatch(getTechnicianDropdown({ parentType: filter.userParentType, parentId }));
    //   }
    // }
    // Fetch all technicians by calling with empty parameters
    dispatch(getTechnicianDropdown({}));
  }, [dispatch]);


  const [cityOptions, setCityOptions] = useState(
    filter.state ? statesAndCities[filter.state] || [] : []
  );


  const hasActiveFilters = !!(
    filter.search ||
    filter.state ||
    filter.city
  );


  const setUrl = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  };

  const handleTabChange = (record) => {
    setActiveTab(record);
    setApprovePage(1);
    setUnapprovePage(1);

    setUrl({ page: 1, limit: 10 });

    handleSearch({
      ...filter,
      page: 1,
    });
  };


  const handleSearch = async (overrideFilter) => {
    const currentFilter = overrideFilter ?? filter;
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;

    const payload = {
      search: [currentFilter.search, currentFilter.city]
        .filter(Boolean)
        .join(" "),
      page: pageFromUrl,
      limit: currentFilter.limit,
      state: currentFilter.state,
      isApproved: activeTab === "approve",
      technicianId: currentFilter.technicianId || "",
      parentType: currentFilter.userParentType || "",
      parentId: currentFilter.userParentId || "",
    };

    dispatch(getProducts(payload));
  };

  const fetchProduct = () => handleSearch(filter);

  useEffect(() => {
    fetchProduct();
  }, [
    activeTab,
    approvePage,
    unapprovePage,
    filter.limit,
    filter.state,
    filter.city,
    filter.technicianId,
    filter.userParentType,
    filter.userParentId,
  ]);
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlLimit = parseInt(searchParams.get("limit")) || 10;
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlState = searchParams.get("state") || "";
    const urlCity = searchParams.get("city") || "";
    const urlUserParentType = searchParams.get("userParentType") || "";
    const urlUserParentId = searchParams.get("userParentId") || "";
    const urlTechnicianId = searchParams.get("technicianId") || "";
    setFilter((prev) => ({
      ...prev,
      search: urlSearch,
      limit: urlLimit,
      state: urlState,
      city: urlCity,
      userParentType: urlUserParentType,
      userParentId: urlUserParentId,
      technicianId: urlTechnicianId,
    }));

    
    if (urlState) {
      setCityOptions(statesAndCities[urlState] || []);
    }

    const isApprove = activeTab === "approve";
    if (isApprove) setApprovePage(urlPage);
    else setUnapprovePage(urlPage);
  }, [searchParams, activeTab]);
  useEffect(() => {
    console.log("Selected State:", filter.state);
    console.log("City Options:", cityOptions);
  }, [filter.state, cityOptions]);


  const getImageUrl = (img) => {
    if (!img) return null;
    let url = img;
    if (typeof img === "object")
      url = img.url || img.path || img.image || img.src;
    if (typeof url === "string" && url.startsWith("/"))
      url = `${process.env.REACT_APP_API_BASE_URL || ""}${url}`;
    return url;
  };

  const renderImages = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0)
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images" />
      );
    return images.map((img, i) => {
      const url = getImageUrl(img);
      if (!url) return null;
      return (
        <Image
          key={i}
          width={120}
          height={120}
          src={url}
          className="rounded-md border cursor-pointer object-cover shadow-sm"
          onClick={() => setImagePreview(url)}
          preview={false}
          fallback="https://via.placeholder.com/120?text=No+Image"
          style={{ backgroundColor: "#f0f0f0" }}
        />
      );
    });
  };

  const columns = [
    { title: "Product Code", dataIndex: "productCode", key: "productCode" },
    { title: "Customer Name", dataIndex: "name", key: "name" },
    {
      title: "State",
      key: "state",
      render: (_, r) => r.address?.state || "-",
    },
    {
      title: "City",
      key: "city",
      render: (_, r) => r.address?.city?.trim() || "-",
    },
    {
      title: "Installation Date",
      dataIndex: "installation_date",
      key: "installation_date",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
    {
      title: "Installation By",
      dataIndex: "installationBy",
      key: "installationBy",
      render: (t) => {
        if (!t) return "-";
        const { name, companyName, type } = t;
        return `${name} - ${companyName} (${type})`;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          {activeTab === "unapprove" && (
            <Button
              type="primary"
              size="small"
              icon={<Icons.CheckCircleOutlined />}
              onClick={() => {
                setSelectedItem(r);
                setApprovalNotes(r.approval_notes || "");
                setApproveModal(true);
              }}
            >
              Approve
            </Button>
          )}
          <Button
            type="default"
            size="small"
            icon={<Icons.EyeOutlined />}
            onClick={() => {
              setSelectedItem(r);
              setViewModal(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (page, pageSize) => {
    setUrl({
      page: page,
      limit: pageSize,
    });
  };

  const handleClearAll = () => {
    const clearedFilter = { search: "", state: "", city: "", limit: 10 };
    setFilter(clearedFilter);
    setCityOptions([]);
    setApprovePage(1);
    setUnapprovePage(1);
    setUrl({ page: 1, limit: 10, search: "", state: "", city: "" });
    handleSearch(clearedFilter);
  };


  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">
              View Product Installations
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Search product installation..."
              value={filter.search}
              onChange={(e) => {
                const v = e.target.value;
                setFilter((prev) => ({ ...prev, search: v }));
                if (!v) {
                  setUrl({ page: 1, search: "" });
                  handleSearch({ ...filter, search: "" });
                }
              }}
              onSearch={(v) => {
                const newFilter = { ...filter, search: v };
                setFilter(newFilter);
                setUrl({ page: 1, search: v });
                handleSearch(newFilter);
              }}

              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
            <Space>
              <Button type="default" onClick={() => setVisible(!visible)}>
                {visible ? "Hide Filters" : "View Filters"}
              </Button>
              <Button
                type="primary"
                icon={<Icons.FilterOutlined />}
                onClick={() => {
                  setUrl({
                    page: 1,
                    limit: filter.limit,
                    search: filter.search,
                    state: filter.state,
                    city: filter.city,
                    userParentType: filter.userParentType,
                    userParentId: filter.userParentId,
                    technicianId: filter.technicianId,
                  });
                  handleSearch();
                }}
              >
                Apply Filter
              </Button>

            </Space>
          </Col>
        </Row>
        {visible && (
          <Row className="mt-3" gutter={16}>
            {/* State Selector */}
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="state"
                label="State"
                placeholder="Select State"
                options={Object.keys(statesAndCities).map((state) => ({
                  label: state,
                  value: state,
                }))}
                value={filter.state || undefined}
                onChange={(value) => {
                  const selectedState = value || "";
                  const newFilter = {
                    ...filter,
                    state: selectedState,
                    city: "",
                  };

                  setFilter(newFilter);
                  setCityOptions(statesAndCities[selectedState] || []);
                  setUrl({ state: selectedState, city: "", page: 1 });

                  handleSearch(newFilter);
                }}

              />
            </Col>

            {/* City Selector */}
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="city"
                label="City"
                placeholder="Select City"
                options={cityOptions.map((city) => ({
                  label: city,
                  value: city,
                }))}
                value={filter.city || undefined}
                disabled={!filter.state}
                onChange={(value) => {
                  const selectedCity = value || "";

                  const newFilter = {
                    ...filter,
                    city: selectedCity,
                  };

                  setFilter(newFilter);
                  setUrl({ city: selectedCity, page: 1 });
                  handleSearch(newFilter);
                }}
              />
            </Col>

            {/* User Parent Type */}
            {/* <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                label="Parent Type"
                placeholder="Select Parent Type"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Distributor", value: "distributor" },
                  { label: "Dealer", value: "dealer" },
                ]}
                value={filter.userParentType || undefined}
                onChange={(v) => setFilter({ ...filter, userParentType: v, userParentId: "", technicianId: "" })}
              />
            </Col> */}

            {/* Distributor Selection
            {filter.userParentType === "distributor" && (
              <Col xs={24} sm={12} md={6}>
                <CustomInput
                  type="select"
                  name="userParentId"
                  label="Distributor"
                  placeholder="Select Distributor"
                  options={distributorDrop.map((d) => ({
                    label: d.name || d.company_name,
                    value: d._id,
                  }))}
                  value={filter.userParentId || undefined}
                  onChange={(v) => setFilter({ ...filter, userParentId: v, technicianId: "" })}
                />
              </Col>
            )}

            {/* Dealer Selection */}
            {/* {filter.userParentType === "dealer" && (
              <Col xs={24} sm={12} md={6}>
                <CustomInput
                  type="select"
                  name="userParentId"
                  label="Dealer"
                  placeholder="Select Dealer"
                  options={dealerDrop.map((d) => ({
                    label: d.name || d.company_name,
                    value: d._id,
                  }))}
                  value={filter.userParentId || undefined}
                  onChange={(v) => setFilter({ ...filter, userParentId: v, technicianId: "" })}
                />
              </Col>
            )} */} 

            {/* Show Technician dropdown if admin OR parent is selected */}
            
              <Col xs={24} sm={12} md={6}>
                <CustomInput
                  type="select"
                  label="Technician"
                  placeholder="Select Technician"
                  options={technicianDropdown.map((t) => ({ label: t.name, value: t._id }))}
                  value={filter.technicianId || undefined}
                  loading={dropdownLoading}
                  disabled={dropdownLoading}
                  onChange={(id) => {
                    setFilter((prev) => ({ ...prev, technicianId: id }));
                    handleSearch({ ...filter, technicianId: id });
                  }}
                />
              </Col>

          </Row>

        )}
        {hasActiveFilters && (
          <Row className="mt-3 p-3 bg-gray-50 border rounded-md" gutter={8}>
            <Col flex="auto">
              <Space wrap>
                {filter.search && (
                  <Tag
                    color="blue"
                    closable
                    onClose={() => {
                      setFilter((prev) => ({ ...prev, search: "" }));
                      setUrl({ page: 1, search: "" });
                      handleSearch({ ...filter, search: "" });
                    }}
                  >
                    Search: {filter.search}
                  </Tag>
                )}
                {filter.state && (
                  <Tag
                    color="green"
                    closable
                    onClose={() => {
                      setFilter((prev) => ({ ...prev, state: "", city: "" }));
                      setUrl({ state: "", city: "" });
                      handleSearch();
                    }}
                  >
                    State: {filter.state}
                  </Tag>
                )}

                {filter.city && (
                  <Tag
                    color="orange"
                    closable
                    onClose={() => {
                      setFilter((prev) => ({ ...prev, city: "" }));
                      setUrl({ city: "" });
                      handleSearch();
                    }}
                  >
                    City: {filter.city}
                  </Tag>
                )}
              </Space>
            </Col>
            <Col>
              <Button size="small" onClick={handleClearAll}>
                Clear All
              </Button>
            </Col>
          </Row>
        )}
      </Card>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "unapprove",
              label: "Pending",
              children: (
                <Spin spinning={loading}>
                  <CustomTable
                    rowKey="_id"
                    columns={columns}
                    data={product}
                    pagination={{
                      current: pagination.page,
                      pageSize: pagination.limit,
                      total: pagination.total || 0,
                      onChange: handleTableChange,
                    }}
                  />
                </Spin>
              ),
            },
            {
              key: "approve",
              label: "Approved",
              children: (
                <Spin spinning={loading}>
                  <CustomTable
                    rowKey="_id"
                    columns={columns}
                    data={product}
                    pagination={{
                      current: pagination.page,
                      pageSize: pagination.limit,
                      total: pagination.total || 0,
                      onChange: handleTableChange,
                    }}
                  />
                </Spin>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Approve Product Installation"
        open={approveModal}
        onCancel={() => setApproveModal(false)}
        footer={null}
        width={800}
      >
        {selectedItem && (
          <>
            <div className="mb-4">
              <p className="font-semibold mb-2">Images:</p>
              <div className="flex flex-wrap gap-3">
                {renderImages(selectedItem.images)}
              </div>
            </div>

            <div>
              <label className="font-semibold mb-1 block">Approval Notes</label>
              <Input.TextArea
                rows={4}
                placeholder="Enter your approval notes..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="font-semibold mb-2 block text-gray-700">
                Product Details:
              </label>

              <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Code:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productCode}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Model:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productModel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Size:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productSize}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Vessel Color:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productVesselColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right mt-4">
              <Button
                type="primary"
                loading={approveLoading}
                onClick={async () => {
                  if (!selectedItem?._id)
                    return message.error("Invalid record");

                  const payload = {
                    _id: selectedItem._id,
                    data: { approval_notes: approvalNotes },
                  };

                  try {
                    await dispatch(approveProducts(payload)).unwrap();
                    message.success("Approved!");
                    setApproveModal(false);
                    fetchProduct();
                  } catch (e) {
                    message.error(e?.message || "Failed");
                  }
                }}
              >
                Submit Approval
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="View Product Installation"
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width={800}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {renderImages(selectedItem.images)}
            </div>
            <div>
              <p className="font-semibold mb-1">Approval Notes:</p>
              <div className="p-3 border rounded-md bg-gray-50">
                {selectedItem.approval_notes || " "}
              </div>
            </div>
            <div className="mt-4">
              <label className="font-semibold mb-2 block text-gray-700">
                Product Details:
              </label>

              <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Code:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productCode}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Model:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productModel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Size:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productSize}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Product Vessel Color:
                  </span>
                  <span className="text-gray-900">
                    {selectedItem.productVesselColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!imagePreview}
        footer={null}
        onCancel={() => setImagePreview(null)}
        centered
        width={900}
        bodyStyle={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
        closable
        closeIcon={<Icons.CloseOutlined style={{ color: "#fff" }} />}
      >
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        )}
      </Modal>
    </div>

  );
};
export default ViewProductInstallation;
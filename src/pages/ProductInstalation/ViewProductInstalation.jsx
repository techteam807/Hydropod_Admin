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
import CustomInput from "../../component/commonComponent/CustomInput";
import { statesAndCities } from "../../constants/cities";
import { getTechnicianDropdown } from "../../redux/slice/technician/technicianSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  approveProducts,
  getProducts,
} from "../../redux/slice/product/productSlice";

import { useNavigate, useSearchParams } from "react-router-dom";
import { FaClipboardCheck } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";

const { Search } = Input;
const { TabPane } = Tabs;

const ViewProductInstallation = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
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
  console.log("sel:", selectedItem);

  const [imagePreview, setImagePreview] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const { technicianDropdown, dropdownLoading } = useSelector(
    (state) => state.technician
  );

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    technicianId: searchParams.get("technicianId") || "",
    limit: parseInt(searchParams.get("limit")) || 10,
  });
  const [cityOptions, setCityOptions] = useState(
    filter.state ? statesAndCities[filter.state] || [] : []
  );

  const hasActiveFilters =
    !!filter.search || !!filter.state || !!filter.city || !!filter.technicianId;

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  };

  const handleTabChange = (record) => {
    updateUrlParams({
      page: 1,
      limit: 10,
    });
    setActiveTab(record);
  };

  const handleSearch = (currentFilter) => {
    const f = currentFilter || filter;
    const isApproved = activeTab === "approve";
    const page = isApproved ? approvePage : unapprovePage;

    // Combine city into search text if it exists
    let searchText = f.search || "";
    if (f.city) {
      searchText = searchText ? `${searchText} ${f.city}` : f.city; // append city to search
    }

    const payload = {
      search: searchText,
      state: f.state || "",
      technicianId: f.technicianId || "",
      page,
      limit: f.limit,
      isApproved,
    };

    dispatch(getProducts(payload));
  };

  const fetchProduct = () => handleSearch(filter.search);

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

  const handleTableChange = (page, pageSize) => {
    updateUrlParams({
      page: page,
      limit: pageSize,
    });
  };

  const handleClearAll = async () => {
    const clearedFilter = {
      search: "",
      state: "",
      city: "",
      technicianId: "",
      limit: 10,
    };

    setFilter(clearedFilter);
    setCityOptions([]);
    setApprovePage(1);
    setUnapprovePage(1);

    updateUrlParams({
      page: 1,
      limit: 10,
      search: "",
      state: "",
      city: "",
      technicianId: "",
    });

    const payload = {
      search: "",
      page: 1,
      limit: 10,
      isApproved: activeTab === "approve",
      state: "",
      technicianId: "",
    };

    await dispatch(getProducts(payload));
  };

  const handleClearFilter = (key) => {
    setFilter((prev) => {
      const updated = { ...prev, [key]: "" };

      if (key === "state") {
        // optionally clear technician when state changes
        updated.technicianId = "";
      }

      handleSearch(updated); // fetch using updated filter
      const paramsUpdate = { page: 1 };
      if (key === "search") paramsUpdate.search = "";
      if (key === "state") paramsUpdate.technicianId = "";
      updateUrlParams(paramsUpdate);

      return updated;
    });
  };

  const columns = [
    { title: "Product Code", dataIndex: "productCode", key: "productCode" },
    { title: "Customer Name", dataIndex: "name", key: "name" },
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
      render: (t) => (t ? `${t.name} [${t.companyName}] (${t.type})` : "-"),
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

  useEffect(() => {
    dispatch(getTechnicianDropdown());
  }, [dispatch]);

  useEffect(() => {
    fetchProduct();
  }, [activeTab, approvePage, unapprovePage, filter.limit]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlLimit = parseInt(searchParams.get("limit")) || 10;
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlState = searchParams.get("state") || "";
    const urlCity = searchParams.get("city") || "";
    const urlTechnicianId = searchParams.get("technicianId") || "";
    const formattedCity = urlCity
      ? urlCity.charAt(0).toUpperCase() + urlCity.slice(1)
      : "";
    setFilter((prev) => ({
      ...prev,
      search: urlSearch,
      limit: urlLimit,
      state: urlState,
      city: urlCity,
      technicianId: urlTechnicianId,
    }));

    // Update city options when state changes from URL
    if (urlState) {
      setCityOptions(statesAndCities[urlState] || []);
    } else {
      setCityOptions([]);
    }

    const isApprove = activeTab === "approve";
    if (isApprove) setApprovePage(urlPage);
    else setUnapprovePage(urlPage);
  }, [searchParams, activeTab]);

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
              // onChange={(e) => {
              //   const v = e.target.value;
              //   setFilter((prev) => ({ ...prev, search: v }));
              //   if (!v) {
              //     updateUrlParams({ page: 1, search: "" });
              //     handleSearch("");
              //   }
              // }}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onSearch={(v) => {
                const newFilter = { ...filter, search: v };
                setFilter(newFilter);
                updateUrlParams({ page: 1, search: v });
                handleSearch(v);
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
                  updateUrlParams({
                    page: 1,
                    limit: filter.limit,
                    search: filter.search,
                    state: filter.state,
                    city: filter.city,
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
          <Row className="mt-2 p-4 border-t border-gray-100" gutter={16}>
            {/* State */}
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                placeholder="Select State"
                options={Object.keys(statesAndCities).map((s) => ({
                  label: s,
                  value: s,
                }))}
                value={filter.state || undefined}
                onChange={(v) => {
                  setFilter({ ...filter, state: v, city: "" });
                  setCityOptions(statesAndCities[v] || []);
                }}
              />
            </Col>

            {/* City */}
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                placeholder="Select City"
                options={cityOptions.map((c) => ({ label: c, value: c }))}
                value={filter.city || undefined}
                onChange={(v) => {
                  const newFilter = { ...filter, city: v };
                  setFilter(newFilter);
                  // handleSearch(newFilter); // city included in search
                }}
                disabled={!filter.state}
              />
            </Col>

            {/* Technician */}
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                placeholder="Select Technician"
                options={technicianDropdown.map((t) => ({
                  label: t.name,
                  value: t._id,
                }))}
                value={filter.technicianId || undefined}
                onChange={(v) => setFilter({ ...filter, technicianId: v })}
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
                    onClose={() => handleClearFilter("search")}
                  >
                    Search: {filter.search}
                  </Tag>
                )}
                {filter.state && (
                  <Tag
                    color="green"
                    closable
                    onClose={() => handleClearFilter("state")}
                  >
                    State: {filter.state}
                  </Tag>
                )}
                {filter.city && (
                  <Tag
                    color="orange"
                    closable
                    onClose={() => handleClearFilter("city")}
                  >
                    City: {filter.city}
                  </Tag>
                )}

                {filter.technicianId && (
                  <Tag
                    color="purple"
                    closable
                    onClose={() => handleClearFilter("technicianId")}
                  >
                    Technician:{" "}
                    {technicianDropdown.find(
                      (t) => t._id === filter.technicianId
                    )?.name || filter.technicianId}
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
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Pending" key="unapprove">
            <h1>Note : Installation By -Tech Name [companyName] (Parent Type)</h1>
            <Spin spinning={loading}>
              <CustomTable
                tableId="pendingProductInstallation"
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
          </TabPane>
          <TabPane tab="Approved" key="approve">
            <Spin spinning={loading}>
              <CustomTable
                tableId="pendingProductInstallation"
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
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Approve Product Installation"
        open={approveModal}
        onCancel={() => setApproveModal(false)}
        footer={null}
        width={800}
      >
        {selectedItem && (
          // <>
          //   <div className="mb-4">
          //     <p className="font-semibold mb-2">Images:</p>
          //     <div className="flex flex-wrap gap-3">
          //       {renderImages(selectedItem.images)}
          //     </div>
          //   </div>

          //   <div>
          //     <label className="font-semibold mb-1 block">Approval Notes</label>
          //     <Input.TextArea
          //       rows={4}
          //       placeholder="Enter your approval notes..."
          //       value={approvalNotes}
          //       onChange={(e) => setApprovalNotes(e.target.value)}
          //     />
          //   </div>

          //   <div className="mt-4">
          //     <label className="font-semibold mb-2 block text-gray-700">
          //       Product Details:
          //     </label>

          //     <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Code:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productCode}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Model:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productModel}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Size:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productSize}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Vessel Color:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productVesselColor}
          //         </span>
          //       </div>
          //     </div>
          //   </div>

          //   <div className="text-right mt-4">
          //     <Button
          //       type="primary"
          //       loading={approveLoading}
          //       onClick={async () => {
          //         if (!selectedItem?._id)
          //           return message.error("Invalid record");

          //         const payload = {
          //           _id: selectedItem._id,
          //           data: { approval_notes: approvalNotes },
          //         };

          //         try {
          //           await dispatch(approveProducts(payload)).unwrap();
          //           message.success("Approved!");
          //           setApproveModal(false);
          //           fetchProduct();
          //         } catch (e) {
          //           message.error(e?.message || "Failed");
          //         }
          //       }}
          //     >
          //       Submit Approval
          //     </Button>
          //   </div>
          // </>
          <div className="max-w-4xl mx-auto p-3 bg-background min-h-screen">
            <div className="grid gap-10">
              {/* Image Galleries Section */}
              <section className="space-y-6">
                {/* Checklist Images */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-medium ">
                    <FaClipboardCheck className="h-4 w-4" />
                    Installation Checklist Images
                  </div>

                  <Image.PreviewGroup>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedItem?.installation_checkList_images?.map((i) => (
                        <div
                          key={i}
                          className="aspect-video relative rounded-lg overflow-hidden bg-muted group"
                        >
                          <Image
                            src={i}
                            alt={i}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>

                {/* Product Images */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-medium ">
                    <LuPackage className="h-4 w-4" />
                    Product Images
                  </div>

                  <Image.PreviewGroup>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedItem?.product_images?.map((i) => (
                        <div
                          key={i}
                          className="aspect-video relative rounded-lg overflow-hidden bg-muted group"
                        >
                          <Image
                            src={i}
                            alt={i}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </section>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                {/* Customer Details */}
                <section className="space-y-4">
                  <h2 className="text-xl border-b pb-2">Customer Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Name :
                      </p>
                      <p className="font-medium">{selectedItem?.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Address :
                      </p>
                      <p className="font-medium leading-relaxed">
                        {[
                          selectedItem?.address?.line1,
                          selectedItem?.address?.line2,
                          selectedItem?.address?.city,
                          selectedItem?.address?.state,
                          selectedItem?.address?.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Email :
                      </p>
                      <p className="font-medium">{selectedItem?.email}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Phone :
                      </p>
                      <p className="font-medium">
                        {selectedItem?.mobile_number}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Product Specs */}
                <section className="space-y-4">
                  <h2 className="text-xl border-b pb-2">Product Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-xs  text-muted-foreground tracking-wider mr-2">
                        Product Code :
                      </p>

                      <p className="font-medium flex-1 text-right truncate">
                        {selectedItem?.productCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Model :
                      </p>
                      <p className="font-medium leading-relaxed">
                        {selectedItem?.productModel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Size :
                      </p>
                      <p className="font-medium">{selectedItem?.productSize}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Vessel Color :
                      </p>
                      <p className="font-medium">
                        {selectedItem?.productVesselColor}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {selectedItem.installation_notes && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor="approval-notes"
                      className="text-sm font-medium"
                    >
                      Installation Notes :
                    </label>
                  </div>

                  <input
                    id="approval-notes"
                    placeholder="Enter any relevant notes or feedback regarding the installation..."
                    className="h-14 w-full px-3 border rounded bg-white"
                    value={selectedItem?.installation_notes}
                    disabled
                  />
                </section>
              )}

              <section className="space-y-4 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="approval-notes"
                    className="text-sm font-medium"
                  >
                    Approval Notes :
                  </label>
                </div>

                <input
                  id="approval-notes"
                  placeholder="Enter any relevant notes or feedback regarding the installation..."
                  className="h-14 w-full px-3 border rounded bg-white"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
              </section>
            </div>
            <div className="text-right pt-5">
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
          </div>
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
          <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
            <div className="grid gap-10">
              {/* Image Galleries Section */}
              <section className="space-y-6">
                {/* Checklist Images */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-medium ">
                    <FaClipboardCheck className="h-4 w-4" />
                    Installation Checklist Images
                  </div>
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedItem?.installation_checkList_images?.map((i) => (
                        <div
                          key={i}
                          className="aspect-video relative rounded-lg overflow-hidden bg-muted group"
                        >
                          <Image
                            src={i}
                            alt={i}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>

                {/* Product Images */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-medium ">
                    <LuPackage className="h-4 w-4" />
                    Product Images
                  </div>
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedItem?.product_images?.map((i) => (
                        <div
                          key={i}
                          className="aspect-video relative rounded-lg overflow-hidden bg-muted group"
                        >
                          <Image
                            src={i}
                            alt={i}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              </section>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                {/* Customer Details */}
                <section className="space-y-4">
                  <h2 className="text-xl border-b pb-2">Customer Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Name :
                      </p>
                      <p className="font-medium">{selectedItem?.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Address :
                      </p>
                      <p className="font-medium leading-relaxed">
                        {[
                          selectedItem?.address?.line1,
                          selectedItem?.address?.line2,
                          selectedItem?.address?.city,
                          selectedItem?.address?.state,
                          selectedItem?.address?.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Email :
                      </p>
                      <p className="font-medium">{selectedItem?.email}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Phone :
                      </p>
                      <p className="font-medium">
                        {selectedItem?.mobile_number}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Product Specs */}
                <section className="space-y-4">
                  <h2 className="text-xl border-b pb-2">Product Details</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-xs  text-muted-foreground tracking-wider mr-2">
                        Product Code :
                      </p>

                      <p className="font-medium flex-1 text-right truncate">
                        {selectedItem?.productCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Model :
                      </p>
                      <p className="font-medium leading-relaxed">
                        {selectedItem?.productModel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Size :
                      </p>
                      <p className="font-medium">{selectedItem?.productSize}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs  text-muted-foreground tracking-wider">
                        Product Vessel Color :
                      </p>
                      <p className="font-medium">
                        {selectedItem?.productVesselColor}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Notes */}
              {selectedItem?.approval_notes && (
                <section className="space-y-4 pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor="approval-notes"
                      className="text-sm font-medium"
                    >
                      Approval Notes :
                    </label>
                  </div>

                  <input
                    id="approval-notes"
                    placeholder="Enter any relevant notes or feedback regarding the installation..."
                    className="h-14 w-full px-3 border rounded bg-white"
                    value={selectedItem?.approval_notes}
                    disabled
                  />
                </section>
              )}
              {selectedItem.installation_notes && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor="approval-notes"
                      className="text-sm font-medium"
                    >
                      Installation Notes :
                    </label>
                  </div>

                  <input
                    id="approval-notes"
                    placeholder="Enter any relevant notes or feedback regarding the installation..."
                    className="h-14 w-full px-3 border rounded bg-white"
                    value={selectedItem?.installation_notes}
                    disabled
                  />
                </section>
              )}
            </div>
          </div>
          // <div className="space-y-4">
          //   <div className="flex flex-wrap gap-3">
          //     {renderImages(selectedItem.images)}
          //   </div>
          //   <div>
          //     <p className="font-semibold mb-1">Approval Notes:</p>
          //     <div className="p-3 border rounded-md bg-gray-50">
          //       {selectedItem.approval_notes || " "}
          //     </div>
          //   </div>
          //   <div className="mt-4">
          //     <label className="font-semibold mb-2 block text-gray-700">
          //       Product Details:
          //     </label>

          //     <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Code:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productCode}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Model:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productModel}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Size:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productSize}
          //         </span>
          //       </div>

          //       <div className="flex justify-between">
          //         <span className="font-medium text-gray-600">
          //           Product Vessel Color:
          //         </span>
          //         <span className="text-gray-900">
          //           {selectedItem.productVesselColor}
          //         </span>
          //       </div>
          //     </div>
          //   </div>
          // </div>
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
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
import { approveProducts, getProducts } from "../../redux/slice/product/productSlice";
import { useSearchParams } from "react-router-dom";

const { Search } = Input;
const { TabPane } = Tabs;

const ViewProductInstallation = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { approveProduct, unapproveProduct, loading, approveLoading, pagination } = useSelector(
        (state) => state.product
    );

    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("unapprove");
    const [approvePage, setApprovePage] = useState(1);
    const [unapprovePage, setUnapprovePage] = useState(1);

    const [filter, setFilter] = useState({
        search: searchParams.get("search") || "",
        state: "",
        city: "",
    });

    const [approveModal, setApproveModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState("");

    const hasActiveFilters = filter.search || filter.state || filter.city;

    // Fetch products from API
    const fetchProduct = async () => {
        const isApproved = activeTab === "approve";
        const page = isApproved ? approvePage : unapprovePage;
        const limit = pagination?.limit || 10;

        const payload = {
            search: filter.search,
            page,
            limit,
            isApproved,
        };

        await dispatch(getProducts(payload));
    };

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, approvePage, unapprovePage]);

    // Helper: Normalize image URL
    const getImageUrl = (img) => {
        if (!img) return null;
        let url = img;
        if (typeof img === "object") url = img.url || img.path || img.image || img.src;
        if (typeof url === "string" && url.startsWith("/")) url = `${API_BASE_URL}${url}`;
        return url;
    };

    // Helper: Render images safely
    const renderImages = (images) => {
        if (!images || !Array.isArray(images) || images.length === 0)
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images" />;
        return images.map((img, index) => {
            const url = getImageUrl(img);
            if (!url) return null;
            return (
                <Image
                    key={index}
                    width={120}
                    height={120}
                    src={url}
                    className="rounded-md border cursor-pointer object-cover shadow-sm"
                    onClick={() => setImagePreview(url)}
                    preview={false}
                    fallback="https://via.placeholder.com/120?text=No+Image"
                    // placeholder={<Spin />}
                    style={{ backgroundColor: "#f0f0f0" }}
                />
            );
        });
    };

    // Table Columns
    const columns = [
        { title: "Product Code", dataIndex: "productCode", key: "productCode" },
        { title: "Customer Name", dataIndex: "name", key: "name" },
        {
            title: "Installation Date",
            dataIndex: "installation_date",
            key: "installation_date",
            render: (date) => (date ? new Date(date).toLocaleString() : "-"),
        },
        {
            title: "Installation By",
            dataIndex: "technicianId",
            key: "technicianId",
            render: (tech) => (tech ? tech.name : "-"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    {activeTab === "unapprove" && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<Icons.CheckCircleOutlined />}
                            onClick={() => {
                                setSelectedItem(record);
                                setApprovalNotes(record.approval_notes || "");
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
                            setSelectedItem(record);
                            setViewModal(true);
                        }}
                    >
                        View Image
                    </Button>
                </Space>
            ),
        },
    ];

    // Pagination handler
    const handleTableChange = (paginationConfig) => {
        const { current } = paginationConfig;
        if (activeTab === "approve") setApprovePage(current);
        else setUnapprovePage(current);
    };

    // Clear all filters
    const handleClearAll = () => {
        setFilter({ search: "", state: "", city: "" });
        setApprovePage(1);
        setUnapprovePage(1);
        fetchProduct();
    };

    return (
        <div className="m-4">
            {/* Header */}
            <Card className="!mb-4">
                <Row align="middle" justify="space-between">
                    <Col>
                        <div className="text-xl font-semibold">View Product Installations</div>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card className="!mb-4">
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={10}>
                        <Search
                            placeholder="Search product installation..."
                            value={filter.search}
                            onChange={(e) => {
                                setFilter({ ...filter, search: e.target.value });
                                if (e.target.value === "") handleClearAll();
                            }}
                            onSearch={fetchProduct}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
                        <Space>
                            <Button type="default" onClick={() => setVisible(!visible)}>
                                {visible ? "Hide Filters" : "View Filters"}
                            </Button>
                            <Button type="primary" icon={<Icons.FilterOutlined />} onClick={fetchProduct}>
                                Apply Filter
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {hasActiveFilters && (
                    <Row className="mt-3 p-3 bg-gray-50 border rounded-md" gutter={8}>
                        <Col flex="auto">
                            <Space wrap>
                                {filter.search && (
                                    <Tag color="blue" closable onClose={handleClearAll}>
                                        Search: {filter.search}
                                    </Tag>
                                )}
                                {filter.state && (
                                    <Tag color="green" closable onClose={handleClearAll}>
                                        State: {filter.state}
                                    </Tag>
                                )}
                                {filter.city && (
                                    <Tag color="orange" closable onClose={handleClearAll}>
                                        City: {filter.city}
                                    </Tag>
                                )}
                            </Space>
                        </Col>
                        <Col>
                            <Button type="default" size="small" onClick={handleClearAll}>
                                Clear All
                            </Button>
                        </Col>
                    </Row>
                )}
            </Card>

            {/* Tabs */}
            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Pending" key="unapprove">
                        <Spin spinning={loading}>
                            <CustomTable
                                tableId="pendingProductInstallation"
                                columns={columns}
                                data={unapproveProduct}
                                pagination={{
                                    current: unapprovePage,
                                    pageSize: pagination.limit,
                                    total: pagination.total,
                                    onChange: handleTableChange,
                                }}
                            />
                        </Spin>
                    </TabPane>
                    <TabPane tab="Approved" key="approve">
                        <Spin spinning={loading}>
                            <CustomTable
                                tableId="approveProductInstallation"
                                columns={columns}
                                data={approveProduct}
                                pagination={{
                                    current: approvePage,
                                    pageSize: pagination.limit,
                                    total: pagination.total,
                                    onChange: handleTableChange,
                                }}
                            />
                        </Spin>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Approve Modal */}
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
                            <div className="flex flex-wrap gap-3">{renderImages(selectedItem.images)}</div>
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

                        <div className="text-right mt-4">
                            <Button
                                type="primary"
                                loading={approveLoading}
                                onClick={async () => {
                                    if (!selectedItem?._id) {
                                        message.error("Invalid product record!");
                                        return;
                                    }

                                    const payload = {
                                        _id: selectedItem._id,
                                        data: { approval_notes: approvalNotes },
                                    };

                                    try {
                                        await dispatch(approveProducts(payload)).unwrap();
                                        message.success("Product approved successfully!");
                                        setApproveModal(false);
                                        fetchProduct();
                                    } catch (error) {
                                        message.error(error || "Failed to approve product.");
                                    }
                                }}
                            >
                                Submit Approval
                            </Button>
                        </div>
                    </>
                )}
            </Modal>

            {/* View Image Modal */}
            <Modal
                title="View Product Installation"
                open={viewModal}
                onCancel={() => setViewModal(false)}
                footer={null}
                width={800}
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">{renderImages(selectedItem.images)}</div>
                        <div>
                            <p className="font-semibold mb-1">Approval Notes:</p>
                            <div className="p-3 border rounded-md bg-gray-50">
                                {selectedItem.approval_notes || "-"}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Full Image Preview */}
            <Modal
                open={!!imagePreview}
                footer={null}
                onCancel={() => setImagePreview(null)}
                centered
                width={900} // Modal width
                bodyStyle={{ padding: 0, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}
                closable
                closeIcon={<Icons.CloseOutlined style={{ color: "#fff" }} />}
            >
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Full Preview"
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

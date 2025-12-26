import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  deleteTechnician,
  getTechnician,
  restoreTechnician,
} from "../../redux/slice/technician/technicianSlice";
import { getDistributorDropdown } from "../../redux/slice/distributor/distributorSlice";
import { getDealerDropdown } from "../../redux/slice/dealer/dealerSlice";
import { filteredURLParams } from "../../utlis/services";
import {
  Button,
  Card,
  Col,
  Input,
  Popconfirm,
  Row,
  Space,
  Tabs,
  Tag,
} from "antd";
import Icons from "../../assets/icon";
import CustomTable from "../../component/commonComponent/CustomTable";
import CustomInput from "../../component/commonComponent/CustomInput";

const { Search } = Input;
const { TabPane } = Tabs;

const ViewTechnician = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeTechnician,
    inactiveTechnician,
    loading,
    pagination,
    deleteLoading,
    restoreLoading,
  } = useSelector((state) => state.technician);
  const { distributorDrop } = useSelector((state) => state.distributor);
  const { dealerDrop } = useSelector((state) => state.dealer);
  const { user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    userParentType: searchParams.get("userParentType") || "",
    userParentId: searchParams.get("userParentId") || "",
  });

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  const fetchTechnician = () => {
    const isActive = activeTab === "active";
    const page = isActive ? activePage : inactivePage;
    const pageSize =
      parseInt(searchParams?.get("limit")) || pagination.limit || 10;

    const payload = {
      search: filter.search || "",
      limit: pageSize,
      page,
      userParentType: filter.userParentType || "",
      userParentId: filter.userParentId || "",
      isActive,
    };

    dispatch(getTechnician(payload));
  };

  useEffect(() => {
    fetchTechnician();
  }, [activeTab, activePage, inactivePage, searchParams]);

  useEffect(() => {
    dispatch(getDistributorDropdown());
    dispatch(getDealerDropdown());
  }, [dispatch]);

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
  };

  const handleFilter = () => {
    const userParentId =
      filter.userParentType === "admin" ? user._id : filter.userParentId || "";

    updateUrlParams({
      page: 1,
      limit: 10,
      search: filter.search || "",
      userParentType: filter.userParentType || "",
      userParentId,
      isActive: activeTab === "active",
    });
    setVisible(false);
  };

  const handleClear = () => {
    setFilter({ search: "", userParentType: "", userParentId: "" });
    updateUrlParams({
      page: 1,
      limit: 10,
      search: "",
      userParentType: "",
      userParentId: "",
      isActive: activeTab === "active",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    if (activeTab === "active") setActivePage(page);
    else setInactivePage(page);

    updateUrlParams({
      page,
      limit: pageSize,
      isActive: activeTab === "active",
    });
  };

  const columns = [
    { title: "Technician Name", dataIndex: "name", key: "name" },
    { title: "Mobile", dataIndex: "mobile_number", key: "mobile_number" },
    { title: "Tech Role", dataIndex: "userRole", key: "userRole" },
    {
      title: "Parent Role",
      dataIndex: "userParentType",
      key: "userParentType",
      render: (type) => {
        const colorMap = {
          admin: "blue",
          distributor: "green",
          dealer: "orange",
        };
        return <Tag color={colorMap[type] || "gray"}>{type?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/technician/edit/${record._id}`)}
          />
          {activeTab === "active" ? (
            <Popconfirm
              title="Delete this technician?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteLoading }}
              onConfirm={async () => {
                await dispatch(deleteTechnician(record._id)).unwrap();
                fetchTechnician();
              }}
            >
              <Button type="default" danger icon={<Icons.DeleteOutlined />} />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Reactivate this technician?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: restoreLoading }}
              onConfirm={async () => {
                await dispatch(restoreTechnician(record._id)).unwrap();
                fetchTechnician();
              }}
            >
              <Button type="default" icon={<Icons.SyncOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const hasActiveFilters = !!filter.search || !!filter.userParentType || !!filter.userParentId;

  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Technicians</div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Icons.PlusCircleOutlined />}
              onClick={() => navigate("/technician/add")}
            >
              Add Technician
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Search Technician..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setVisible(!visible)}>
                {visible ? "Hide Filters" : "View Filters"}
              </Button>
              <Button
                type="primary"
                icon={<Icons.FilterOutlined />}
                onClick={handleFilter}
              >
                Apply Filter
              </Button>
            </Space>
          </Col>
        </Row>

        {visible && (
          <Row className="mt-2 p-4 border-t border-gray-100" gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="userParentType"
                label="Parent Role"
                placeholder="Select Parent Role"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Distributor", value: "distributor" },
                  { label: "Dealer", value: "dealer" },
                ]}
                value={filter.userParentType || undefined}
                onChange={(v) =>
                  setFilter({ ...filter, userParentType: v, userParentId: "" })
                }
              />
            </Col>

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
                  onChange={(v) => setFilter({ ...filter, userParentId: v })}
                />
              </Col>
            )}

            {filter.userParentType === "dealer" && (
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
                  onChange={(v) => setFilter({ ...filter, userParentId: v })}
                />
              </Col>
            )}
          </Row>
        )}

{hasActiveFilters && (
  <Row className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
    <Col flex="auto">
      <Space wrap>
        {/* Search Tag */}
        {filter.search && (
          <Tag
            color="blue"
            closable
            onClose={() => {
              const newFilter = { ...filter, search: "" };
              setFilter(newFilter);
              updateUrlParams({
                ...newFilter,
                page: 1,
                limit: 10,
                isActive: activeTab === "active",
              });
              fetchTechnician();
            }}
          >
            Search: {filter.search}
          </Tag>
        )}

        {/* Parent Role Tag */}
        {filter.userParentType && (
          <Tag
            color="green"
            closable
            onClose={() => {
              const newFilter = { ...filter, userParentType: "", userParentId: "" };
              setFilter(newFilter);
              updateUrlParams({
                ...newFilter,
                page: 1,
                limit: 10,
                isActive: activeTab === "active",
              });
              fetchTechnician();
            }}
          >
            Parent Role: {filter.userParentType.toUpperCase()}
          </Tag>
        )}

        {/* Distributor/Dealer Tag */}
        {filter.userParentId && (
          <Tag
            color="orange"
            closable
            onClose={() => {
              const newFilter = { ...filter, userParentId: "" };
              setFilter(newFilter);
              updateUrlParams({
                ...newFilter,
                page: 1,
                limit: 10,
                isActive: activeTab === "active",
              });
              fetchTechnician();
            }}
          >
            {filter.userParentType === "distributor"
              ? `Distributor: ${distributorDrop.find(d => d._id === filter.userParentId)?.name || "-"}`
              : filter.userParentType === "dealer"
              ? `Dealer: ${dealerDrop.find(d => d._id === filter.userParentId)?.name || "-"}`
              : ""}
          </Tag>
        )}
      </Space>
    </Col>

    <Col>
      <Button size="small" onClick={handleClear}>Clear All</Button>
    </Col>
  </Row>
)}

      </Card>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Active" key="active">
            <CustomTable
              tableId="activeTechnician"
              columns={columns}
              data={activeTechnician}
              loading={loading}
              pagination={{
                current: activePage,
                pageSize: 10,
                total: pagination.total || 0,
                onChange: handlePaginationChange,
              }}
            />
          </TabPane>

          <TabPane tab="Inactive" key="inactive">
            <CustomTable
              tableId="inactiveTechnician"
              columns={columns}
              data={inactiveTechnician}
              loading={loading}
              pagination={{
                current: inactivePage,
                pageSize: 10,
                total: pagination.total || 0,
                onChange: handlePaginationChange,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ViewTechnician;

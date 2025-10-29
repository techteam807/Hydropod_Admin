import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Space,
  Popconfirm,
  Tag,
  Tabs,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { filteredURLParams } from "../../utlis/services";
import {
  deleteDistributor,
  getDistributor,
  restoreDistributor,
} from "../../redux/slice/distributor/distributorSlice";
import CustomInput from "../../component/commonComponent/CustomInput";
import { statesAndCities } from "../../constants/cities";

const { Search } = Input;
const { TabPane } = Tabs;

const ViewDistributor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeDistributors,
    inactiveDistributors,
    loading,
    deleteLoading,
    restoreLoading,
    pagination,
  } = useSelector((state) => state.distributor);

  const [searchParams, setSearchParams] = useSearchParams();
  const [visiable, setVisiable] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
  });

  // ✅ Fetch distributors based on tab and filter
  const fetchDistributor = () => {
    const isActive = activeTab === "active";
    const page = isActive ? activePage : inactivePage;
    const pageSize =
      parseInt(searchParams?.get("limit")) || pagination.limit || 10;

    const payload = {
      search: filter.search || "",
      state: filter.state || "",
      city: filter.city || "",
      limit: pageSize,
      page,
      isActive,
    };

    dispatch(getDistributor(payload));
  };

  // ✅ Fetch when tab, page, or filters change
  useEffect(() => {
    fetchDistributor();
  }, [activeTab, activePage, inactivePage, searchParams]);

  // ✅ Reset pagination when switching tabs
  useEffect(() => {
    if (activeTab === "active") {
      setActivePage(1);
    } else {
      setInactivePage(1);
    }
    fetchDistributor();
  }, [activeTab]);

  // ✅ URL helpers
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
  };

  const handleVisible = () => {
    setVisiable(!visiable);
  };

  const handleFilter = () => {
    const params = {
      page: 1,
      limit: 10,
      search: filter.search || "",
      state: filter.state || "",
      city: filter.city || "",
      isActive: activeTab === "active",
    };
    updateUrlParams(params);
    setVisiable(false);
  };

  const handleClear = () => {
    setFilter({ search: "", state: "", city: "" });
    updateUrlParams({
      page: 1,
      limit: 10,
      search: "",
      state: "",
      city: "",
      isActive: activeTab === "active",
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    if (activeTab === "active") {
      setActivePage(page);
    } else {
      setInactivePage(page);
    }

    updateUrlParams({
      page,
      limit: pageSize,
      isActive: activeTab === "active",
    });
  };

  const columns = [
    { title: "Company Name", dataIndex: "company_name", key: "company_name" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile_number", key: "mobile_number" },
    {
      title: "City",
      key: "city",
      render: (_, record) => record.address?.city || "-",
    },
    {
      title: "State",
      key: "state",
      render: (_, record) => record.address?.state || "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
        type="default"
        icon={<Icons.EyeOutlined />}
        onClick={() => navigate(`/distributor/view/${record._id}`)}
      />
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/distributor/edit/${record._id}`)}
          />
          {activeTab === "active" ? (
            <Popconfirm
              title="Are you sure you want to delete this distributor?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteLoading }}
              onConfirm={async () => {
                await dispatch(deleteDistributor(record._id)).unwrap();
                fetchDistributor();
              }}
            >
              <Button type="default" danger icon={<Icons.DeleteOutlined />} />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to reactivate this distributor?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: restoreLoading }}
              onConfirm={async () => {
                await dispatch(restoreDistributor(record._id)).unwrap();
                fetchDistributor();
              }}
            >
              <Button type="default" danger icon={<Icons.SyncOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const hasActiveFilters = filter.search || filter.state || filter.city;

  return (
    <div className="m-4">
      {/* Header */}
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Distributors</div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Icons.PlusCircleOutlined />}
              onClick={() => navigate("/distributor/add")}
            >
              Add Distributor
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Search
              placeholder="Search distributor..."
              value={filter.search}
              onChange={(e) =>
                setFilter({ ...filter, search: e.target.value })
              }
              onSearch={handleSearch}
              allowClear
              style={{ borderRadius: 6, height: 36 }}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <Button type="default" onClick={handleVisible}>
              {visiable ? "Hide Filters" : "View Filters"}
            </Button>
            <Button
              type="primary"
              icon={<Icons.FilterOutlined />}
              onClick={handleFilter}
            >
              Apply Filter
            </Button>
          </Col>
        </Row>

        {visiable && (
          <Row className="mt-3" gutter={16}>
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
                onChange={(value) =>
                  setFilter({ ...filter, state: value, city: "" })
                }
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="city"
                label="City"
                placeholder="Select City"
                options={
                  filter.state
                    ? statesAndCities[filter.state].map((city) => ({
                        label: city,
                        value: city,
                      }))
                    : []
                }
                value={filter.city || undefined}
                onChange={(value) => setFilter({ ...filter, city: value })}
                disabled={!filter.state}
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
                      setFilter({ ...filter, search: "" });
                      updateUrlParams({ search: "" });
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
                      setFilter({ ...filter, state: "", city: "" });
                      updateUrlParams({ state: "", city: "" });
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
                      setFilter({ ...filter, city: "" });
                      updateUrlParams({ city: "" });
                    }}
                  >
                    City: {filter.city}
                  </Tag>
                )}
              </Space>
            </Col>
            <Col>
              <Button type="default" size="small" onClick={handleClear}>
                Clear All
              </Button>
            </Col>
          </Row>
        )}
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Active" key="active">
            <CustomTable
              tableId="activeDistributor"
              columns={columns}
              data={activeDistributors}
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
              tableId="inactiveDistributor"
              columns={columns}
              data={inactiveDistributors}
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

export default ViewDistributor;

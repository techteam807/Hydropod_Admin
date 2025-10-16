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
import { filteredURLParams, getQueryParams } from "../../utlis/services";
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
  const { distributor, loading, deleteLoading, restoreLoading, pagination } = useSelector(
    (state) => state.distributor
  );

  console.log("distributor", distributor);

  const [searchParams, setSearchParams] = useSearchParams();
  const [visiable, setVisiable] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  console.log("activeTab", activeTab);

  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
  });

  const fetchDistributor = () => {
    const page = parseInt(searchParams?.get("page")) || 1;
    const isActive = activeTab === "active" ? true : false;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);

    if (Object.keys(payload)?.length <= 0) {
      payload = { page, limit: pageSize, isActive };
    }
    dispatch(getDistributor({ ...payload }));
  };

  useEffect(() => {
    fetchDistributor();
  }, [dispatch, searchParams, activeTab]);

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
      isActive: activeTab === "active" ? true : false,
    };
    updateUrlParams(params);
    setVisiable(false);
  };

  const handleClear = () => {
    setFilter({ search: "", state: "", city: "" });
    updateUrlParams({ page: 1, limit: 10, search: "", state: "", city: "", isActive: activeTab === "active" ? true : false });
  };

  const handlePaginationChange = (page, pageSize) => {
    if (activeTab === "active") {
      setActivePage(page);
    } else {
      setInactivePage(page);
    }
    updateUrlParams({ page, limit: pageSize, isActive: activeTab === "active" ? true : false });
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
    // { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* <Button
            type="default"
            icon={<Icons.EyeOutlined />}
          /> */}
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/distributor/edit/${record._id}`)}
          />
          {activeTab === "active" ? (
            <Popconfirm
              title="Are you sure you want to delete this customer?"
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
          ) : null}
          {activeTab !== "active" ? (
            <Popconfirm
              title="Are you sure you want to reactivate this Distributor?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: restoreLoading }}
              onConfirm={async () => {
                await dispatch(restoreDistributor(record._id)).unwrap();
                fetchDistributor();
              }}
            // onClick={() => window.location.reload()}
            >
              <Button type="default" danger icon={<Icons.SyncOutlined />} />
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  const hasActiveFilters = filter.search || filter.state || filter.city;

  const activeDistributors = distributor || [];
  const inactiveDistributors = distributor || [];

  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Distributors</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                onClick={() => navigate("/distributor/add")}
              >
                Add Distributor
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Search
              placeholder="Search distributor..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onSearch={handleSearch}
              allowClear
              onClear={handleClear}
              style={{ borderRadius: 6, height: 36 }}
            />
          </Col>
          <Col span={14} className="!space-x-2" style={{ textAlign: "right" }}>
            <Button type="default" size="middle" onClick={handleVisible}>
              {visiable ? "Hide Filters" : "View Filters"}
            </Button>
            <Button
              type="primary"
              icon={<Icons.FilterOutlined />}
              size="middle"
              onClick={handleFilter}
            >
              Apply Filter
            </Button>
          </Col>
        </Row>

        {visiable && (
          <Row className="!border-t border-gray-100 mt-2 p-4" gutter={16}>
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

            {/* City Dropdown */}
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
          <Row
            className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md"
            gutter={8}
            align="middle"
          >
            <Col flex="auto">
              <Space wrap>
                {filter.search && (
                  <Tag
                    color="blue"
                    closable
                    onClose={() => {
                      const updated = { ...filter, search: "" };
                      setFilter(updated);
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
                      const updated = { ...filter, state: "", city: "" };
                      setFilter(updated);
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
                      const updated = { ...filter, city: "" };
                      setFilter(updated);
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

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteDealer, getDealer } from "../../redux/slice/dealer/dealerSlice";
import { getDistributorDropdown } from "../../redux/slice/distributor/distributorSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
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
import { statesAndCities } from "../../constants/cities";

const { Search } = Input;
const { TabPane } = Tabs;

const ViewDealer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dealer, loading, deleteLoading, pagination } = useSelector(
    (state) => state.dealer
  );
  const { distributorDrop } = useSelector((state) => state.distributor);

  const [searchParams, setSearchParams] = useSearchParams();
  const [visiable, setVisiable] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    distributorId: searchParams.get("distributorId") || "",
  });

  const [cityOptions, setCityOptions] = useState(
    filter.state ? statesAndCities[filter.state] || [] : []
  );

  // Fetch dealers
  const fetchDealer = () => {
    const page = parseInt(searchParams?.get("page")) || 1;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);
    if (Object.keys(payload)?.length <= 0) {
      payload = { page, limit: pageSize };
    }
    dispatch(getDealer({ ...payload }));
  };

  useEffect(() => {
    fetchDealer();
  }, [dispatch, searchParams]);

  // Fetch distributor dropdown
  useEffect(() => {
    dispatch(getDistributorDropdown());
  }, [dispatch]);

  // Update URL params
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  // Handle filter apply
  const handleFilter = () => {
    const params = {
      page: 1,
      limit: 10,
      search: filter.search || "",
      state: filter.state || "",
      city: filter.city || "",
      distributorId: filter.distributorId || "",
    };
    updateUrlParams(params);
    setVisiable(false);
  };

  const handleClear = () => {
    setFilter({ search: "", state: "", city: "", distributorId: "" });
    setCityOptions([]);
    updateUrlParams({
      page: 1,
      limit: 10,
      search: "",
      state: "",
      city: "",
      distributorId: "",
    });
  };

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
  };

  const handlePaginationChange = (page) => {
    if (activeTab === "active") setActivePage(page);
    else setInactivePage(page);
  };

  // Columns
  const columns = [
    {
      title: "Distributor Name",
      dataIndex: "distributorId",
      key: "distributorId",
      render: (distributor) =>
        distributor?.name || distributor?.company_name || "-",
    },
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
          {/* <Button type="default" icon={<Icons.EyeOutlined />} /> */}
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/dealer/edit/${record._id}`)}
          />
          {activeTab === "active" ? (
            <Popconfirm
              title="Are you sure you want to delete this Dealer?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteLoading }}
              onConfirm={async () => {
                await dispatch(deleteDealer(record._id)).unwrap();
                fetchDealer();
              }}
            >
              <Button type="default" danger icon={<Icons.DeleteOutlined />} />
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  const hasActiveFilters =
    filter.search || filter.state || filter.city || filter.distributorId;

  const activeDealer = dealer?.filter((d) => d.isActive) || [];
  const inactiveDealer = dealer?.filter((d) => !d.isActive) || [];

  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Dealer</div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Icons.PlusCircleOutlined />}
              onClick={() => navigate("/dealer/add")}
            >
              Add Dealer
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filter Card */}
      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Search Dealer..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={14} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setVisiable(!visiable)}>
                {visiable ? "Hide Filters" : "View Filters"}
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

        {visiable && (
          <Row className="mt-2 p-4 border-t border-gray-100" gutter={16}>
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
                  setFilter({ ...filter, state: value, city: "" });
                  setCityOptions(statesAndCities[value] || []);
                }}
              />
            </Col>

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
                onChange={(value) => setFilter({ ...filter, city: value })}
                disabled={!filter.state}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="distributorId"
                label="Distributor"
                placeholder="Select Distributor"
                options={distributorDrop.map((d) => ({
                  label: d.name || d.company_name,
                  value: d._id,
                }))}
                value={filter.distributorId || undefined}
                onChange={(value) =>
                  setFilter({ ...filter, distributorId: value })
                }
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
                      setCityOptions([]);
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
                {filter.distributorId && (
                  <Tag
                    color="purple"
                    closable
                    onClose={() => {
                      setFilter({ ...filter, distributorId: "" });
                      updateUrlParams({ distributorId: "" });
                    }}
                  >
                    Distributor:{" "}
                    {distributorDrop.find((d) => d._id === filter.distributorId)
                      ?.name || "-"}
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

      {/* Dealer Table */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Active" key="active">
            <CustomTable
              tableId="activeDealer"
              columns={columns}
              data={activeDealer}
              loading={loading}
              pagination={{
                current: activePage,
                pageSize: 10,
                total: activeDealer.length,
                onChange: handlePaginationChange,
              }}
            />
          </TabPane>
          <TabPane tab="Inactive" key="inactive">
            <CustomTable
              tableId="inactiveDealer"
              columns={columns}
              data={inactiveDealer}
              loading={loading}
              pagination={{
                current: inactivePage,
                pageSize: 10,
                total: inactiveDealer.length,
                onChange: handlePaginationChange,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ViewDealer;

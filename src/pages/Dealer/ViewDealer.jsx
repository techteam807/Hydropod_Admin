import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  deleteDealer,
  getDealer,
  restoreDealer,
} from "../../redux/slice/dealer/dealerSlice";
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
  const { activeDealer, inactiveDealer, loading, deleteLoading, restoreLoading, pagination } =
    useSelector((state) => state.dealer);
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

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  const fetchDealer = () => {
    const isActive = activeTab === "active";
    const page = isActive ? activePage : inactivePage;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit || 10;

    const payload = {
      search: filter.search || "",
      state: filter.state || "",
      city: filter.city || "",
      distributorId: filter.distributorId || "",
      page,
      limit: pageSize,
      isActive,
    };

    dispatch(getDealer(payload));
  };

  useEffect(() => {
    fetchDealer();
  }, [activeTab, activePage, inactivePage, searchParams]);

  useEffect(() => {
    dispatch(getDistributorDropdown());
  }, [dispatch]);

  const handleFilter = () => {
    updateUrlParams({
      page: 1,
      limit: 10,
      search: filter.search || "",
      state: filter.state || "",
      city: filter.city || "",
      distributorId: filter.distributorId || "",
      isActive: activeTab === "active",
    });
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
      isActive: activeTab === "active",
    });
  };

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
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
    {
      title: "Distributor Name",
      dataIndex: "distributorId",
      key: "distributorId",
      render: (distributor) =>
        distributor?.name || distributor?.company_name || "-",
    },
    { title: "Company Name", dataIndex: "company_name", key: "company_name" },
    { title: "Name", dataIndex: "name", key: "name" },
    {title: "MSME" , dataIndex: "msme_number" , key: "msme_number"},
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
                  onClick={() => navigate(`/dealer/view/${record._id}`)}
                />
          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            onClick={() => navigate(`/dealer/edit/${record._id}`)}
          />
          {activeTab === "active" ? (
            <Popconfirm
              title="Are you sure you want to delete this Dealer?"
              okText="Yes"
              okButtonProps={{ loading: deleteLoading }}
              onConfirm={async () => {
                await dispatch(deleteDealer(record._id)).unwrap();
                fetchDealer();
              }}
            >
              <Button type="default" danger icon={<Icons.DeleteOutlined />} />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to reactivate this Dealer?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: restoreLoading }}
              onConfirm={async () => {
                await dispatch(restoreDealer(record._id)).unwrap();
                fetchDealer();
              }}
            >
              <Button type="default" icon={<Icons.SyncOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const hasActiveFilters =
    filter.search || filter.state || filter.city || filter.distributorId;

  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Dealers</div>
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

      {/* Filters */}
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
            <Col xs={24} sm={12} md={6}>
              <CustomInput
                type="select"
                name="city"
                label="City"
                placeholder="Select City"
                options={cityOptions.map((c) => ({ label: c, value: c }))}
                value={filter.city || undefined}
                onChange={(v) => setFilter({ ...filter, city: v })}
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
                onChange={(v) => setFilter({ ...filter, distributorId: v })}
              />
            </Col>
          </Row>
        )}

        {hasActiveFilters && (
          <Row className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <Col flex="auto">
              <Space wrap>
                {filter.search && (
                  <Tag color="blue" closable onClose={() => handleClear()}>
                    Search: {filter.search}
                  </Tag>
                )}
              </Space>
            </Col>
            <Col>
              <Button onClick={handleClear}>Clear All</Button>
            </Col>
          </Row>
        )}
      </Card>

      {/* Tabs */}
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
                total: pagination.total || 0,
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

export default ViewDealer;
  
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filteredURLParams, getQueryParams } from '../../utlis/services';
import { Button, Card, Col, Input, Popconfirm, Row, Space, Tabs, Tag } from 'antd';
import Icons from '../../assets/icon';
import CustomTable from '../../component/commonComponent/CustomTable';
import { getTechnician } from '../../redux/slice/technician/technicianSlice';
import CustomInput from '../../component/commonComponent/CustomInput';
import { getDistributorDropdown } from '../../redux/slice/distributor/distributorSlice';
import { getDealerDropdown } from '../../redux/slice/dealer/dealerSlice';

const { Search } = Input;
const { TabPane } = Tabs;

const ViewTechnician = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { technician, loading, pagination } = useSelector((state) => state.technician);
  const { distributorDrop } = useSelector((state) => state.distributor);
  const { dealerDrop } = useSelector((state) => state.dealer);
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [visiable, setVisiable] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    userParentType: searchParams.get("userParentType") || "",
    userParentId: searchParams.get("userParentId") || "",
  });

  const fetchTechnician = () => {
    const page = parseInt(searchParams?.get("page")) || 1;
    const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

    let payload = getQueryParams(window.location.href);

    if (Object.keys(payload)?.length <= 0) {
      payload = { page, limit: pageSize };
    }
    dispatch(getTechnician({ ...payload }));
  };

  useEffect(() => {
    fetchTechnician();
  }, [dispatch, searchParams]);

  useEffect(() => {
    dispatch(getDistributorDropdown());
    dispatch(getDealerDropdown());
  }, [dispatch]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
  };

  const handleVisible = () => {
    setVisiable(!visiable)
  }

  const handleFilter = () => {
    const userParentId =
      filter.userParentType === "Admin"
        ? user._id
        : filter.userParentId || "";

    const params = {
      page: 1,
      limit: 10,
      search: filter.search || "",
      userParentType: filter.userParentType || "",
      userParentId: userParentId,
    };
    updateUrlParams(params);
    setVisiable(false);
  };

  const handleClear = () => {
    setFilter({ search: "", userParentType: "", userParentId: "" });
    updateUrlParams({ page: 1, limit: 10, search: "", userParentType: "", userParentId: "" });
    fetchTechnician({ page: 1, limit: 10 });
  };

  const handlePaginationChange = (page, pageSize) => {
    if (activeTab === "active") {
      setActivePage(page);
    } else {
      setInactivePage(page);
    }
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
      let color = "gray"; // default color
      if (type === "admin") color = "blue";
      else if (type === "distributor") color = "green";
      else if (type === "dealer") color = "orange";

      return <Tag color={color}>{type.toUpperCase()}</Tag>;
    },
  },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<Icons.EyeOutlined />}
          // onClick={() => navigate(`/customer/view/${record._id}`)}
          />

          <Button
            type="primary"
            icon={<Icons.EditOutlined />}
            // onClick={() => navigate(`/technician/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            okText="Yes"
            cancelText="No"
          // okButtonProps={{ loading: deleteLoading }}
          // onConfirm={async () => {
          //   try {
          //     await dispatch(deleteCustomerVendor(record._id)).unwrap();
          //     message.success("Customer deleted successfully");
          //   } catch (err) {
          //     message.error(err || "Failed to delete customer");
          //   }
          // }}
          >
            <Button type="default" danger icon={<Icons.DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const hasActiveFilters =
    filter.search || filter.userParentType || filter.userParentId;

  const activeTechnician = technician?.filter((d) => d.isActive) || [];
  const inactiveTechnician = technician?.filter((d) => !d.isActive) || [];


  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Technician</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                onClick={() => navigate("/technician/add")}
              >
                Add Technician
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Search
              placeholder="Search Technician..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              onSearch={handleSearch}
              allowClear
              onClear={handleClear}
              style={{ borderRadius: 6, height: 36 }}
            />
          </Col>
          <Col span={14} className="!space-x-2" style={{ textAlign: "right" }}>
            <Button
              type="default"
              size="middle"
              onClick={handleVisible}
            >
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
                name="userParentType"
                label="Parent Role"
                placeholder="Select Parent Role"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Distributor", value: "distributor" },
                  { label: "Dealer", value: "dealer" },
                ]}
                value={filter.userParentType || undefined}
                onChange={(value) => setFilter({ ...filter, userParentType: value, userParentId: "" })}
              />
            </Col>
            {/* {filter.userParentType === "admin" && (
              <Col xs={24} sm={12} md={6}>
                <CustomInput type="text" label="Admin" value={user._id} disabled />
              </Col>
            )} */}
            {filter.userParentType === "distributor" && distributorDrop.length > 0 && (
              <Col xs={24} sm={12} md={6}>
                <CustomInput
                  type="select"
                  name="userParentId"
                  label="Distributor"
                  placeholder="Select Distributor"
                  options={distributorDrop.map(d => ({ label: d.name || d.company_name, value: d._id }))}
                  value={filter.userParentId || undefined}
                  onChange={(value) => setFilter({ ...filter, userParentId: value })}
                />
              </Col>
            )}

            {filter.userParentType === "dealer" && dealerDrop.length > 0 && (
              <Col xs={24} sm={12} md={6}>
                <CustomInput
                  type="select"
                  name="userParentId"
                  label="Dealer"
                  placeholder="Select Dealer"
                  options={dealerDrop.map(d => ({ label: d.name || d.company_name, value: d._id }))}
                  value={filter.userParentId || undefined}
                  onChange={(value) => setFilter({ ...filter, userParentId: value })}
                />
              </Col>
            )}


          </Row>
        )}
        {hasActiveFilters && (
          <Row className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md" gutter={8} align="middle">
            <Col flex="auto">
              <Space wrap>
                {filter.search && <Tag color="blue" closable onClose={() => { setFilter({ ...filter, search: "" }); updateUrlParams({ search: "" }); }}>Search: {filter.search}</Tag>}
                {filter.state && <Tag color="green" closable onClose={() => { setFilter({ ...filter, state: "", city: "" }); setCityOptions([]); updateUrlParams({ state: "", city: "" }); }}>State: {filter.state}</Tag>}
                {filter.city && <Tag color="orange" closable onClose={() => { setFilter({ ...filter, city: "" }); updateUrlParams({ city: "" }); }}>City: {filter.city}</Tag>}
                {filter.userParentType && <Tag color="purple" closable onClose={() => { setFilter({ ...filter, userParentType: "", userParentId: "" }); updateUrlParams({ userParentType: "", userParentId: "" }); }}>Parent Role: {filter.userParentType}</Tag>}
              </Space>
            </Col>
            <Col>
              <Button type="default" size="small" onClick={handleClear}>Clear All</Button>
            </Col>
          </Row>
        )}
      </Card>

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
                total: activeTechnician.length,
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
                total: inactiveTechnician.length,
                onChange: handlePaginationChange,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default ViewTechnician

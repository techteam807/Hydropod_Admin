import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDealer } from '../../redux/slice/dealer/dealerSlice';
import { filteredURLParams, getQueryParams } from '../../utlis/services';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Card, Col, Input, Popconfirm, Row, Space } from 'antd';
import Icons from '../../assets/icon';
import CustomTable from '../../component/commonComponent/CustomTable';

const { Search } = Input;

const ViewDealer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dealer, loading, pagination } = useSelector((state) => state.dealer);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
  });

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

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filtered = filteredURLParams(params, newParams);
    setSearchParams(filtered);
  };

  const handleSearch = () => {
    updateUrlParams({ page: 1, limit: 10, search: filter.search });
  };

  const handleClear = () => {
    updateUrlParams({ page: 1, limit: 10, search: "" });
    setFilter({ search: "" });
  };

  const handlePaginationChange = (page, limit) => {
    updateUrlParams({ page, limit });
  };

  const columns = [
    { title: "Distributor Name", dataIndex: "distributorId", key: "distributorId" },
    { title: "Company Name", dataIndex: "company_name", key: "company_name" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile_number", key: "mobile_number" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
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
            onClick={() => navigate(`/dealer/edit/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this Dealer?"
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
  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Dealer</div>
          </Col>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                icon={<Icons.PlusCircleOutlined />}
                onClick={() => navigate("/dealer/add")}
              >
                Add Dealer
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="!mb-4">
        <Row gutter={16} align="middle">
          <Col span={10}>
            <Search
              placeholder="Search Dealer..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              onSearch={handleSearch}
              allowClear
              onClear={handleClear}
            />
          </Col>
          <Col span={14} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<Icons.FilterOutlined />}
              size="middle"
              onClick={handleSearch}
            >
              Apply Filter
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <CustomTable
          tableId="dealerId"
          columns={columns}
          data={dealer || []}
          loading={loading}
          pagination={{
            current: parseInt(searchParams?.get("page")) || 1,
            pageSize: parseInt(searchParams?.get("limit")) || 10,
            total: pagination.total,
            onChange: handlePaginationChange,
          }}
        />
      </Card>
    </div>
  )
}

export default ViewDealer

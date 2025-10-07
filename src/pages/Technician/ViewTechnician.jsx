import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filteredURLParams, getQueryParams } from '../../utlis/services';
import { Button, Card, Col, Input, Popconfirm, Row, Space } from 'antd';
import Icons from '../../assets/icon';
import CustomTable from '../../component/commonComponent/CustomTable';
import { getTechnician } from '../../redux/slice/technician/technicianSlice';

const { Search } = Input;

const ViewTechnician = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { technician, loading, pagination } = useSelector((state) => state.technician);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
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
    { title: "Technician Name", dataIndex: "name", key: "name" },
    { title: "Mobile", dataIndex: "mobile_number", key: "mobile_number" },
    { title: "Tech Role", dataIndex: "userRole", key: "userRole" },
    { title: "Parent Role", dataIndex: "userParentType", key: "userParentType" },
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
            onClick={() => navigate(`/technician/edit/${record._id}`)}
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
          tableId="technicianId"
          columns={columns}
          data={technician || []}
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

export default ViewTechnician

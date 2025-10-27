import { Button, Card, Col, Form, Radio, Row, Select, Spin, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../../component/commonComponent/CustomInput';
import { useNavigate, useParams } from 'react-router-dom';
import Icons from '../../assets/icon';
import { getDealerDropdown } from '../../redux/slice/dealer/dealerSlice';
import { getDistributorDropdown } from '../../redux/slice/distributor/distributorSlice';
import { addTechnician, getTechnician, updateTechnician } from '../../redux/slice/technician/technicianSlice';

const { Title } = Typography;

const AddTechnician = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { technicianId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const { technician, loading, postLoading } = useSelector((state) => state.technician);
  const [userType, setUserType] = useState('Admin');
  const { distributorDrop } = useSelector((state) => state.distributor);
  const { dealerDrop } = useSelector((state) => state.dealer);
  const isEditing = !!technicianId;

  useEffect(() => {
    if (technicianId) {
      dispatch(getTechnician({ limit: 100, page: 1 }));
    }
    if (userType === 'Distributor') {
      dispatch(getDistributorDropdown());
    } else if (userType === 'Dealer') {
      dispatch(getDealerDropdown());
    }
    if (!technicianId) {
      form.setFieldsValue({
        userName: user?.name || '',
        distributorId: null,
        dealerId: null,
      });
    }
  }, [userType, dispatch, form, technicianId, user]);

  useEffect(() => {
    if (technicianId && technician.length > 0 && distributorDrop.length > 0) {
      const selectedTechnician = technician.find((t) => t._id === technicianId);
      if (selectedTechnician) {
        const mappedUserType = selectedTechnician.userParentType === 'admin' ? 'Admin' : 
                              selectedTechnician.userParentType === 'distributor' ? 'Distributor' : 'Dealer';
        setUserType(mappedUserType);
        setFilteredDealers([]);

        let distributorId = null;
        if (selectedTechnician.userParentType === 'distributor') {
          distributorId = selectedTechnician.userParentId;
        } else if (selectedTechnician.userParentType === 'dealer') {
          const dealer = dealerDrop.find((d) => d._id === selectedTechnician.userParentId);
          distributorId = dealer ? dealer.distributorId : null;
          const dealers = dealerDrop.filter((d) => d.distributorId === distributorId);
          setFilteredDealers(dealers);
        }

        form.setFieldsValue({
          userType: mappedUserType,
          userName: selectedTechnician.userParentType === 'admin' ? user?.name || '' : undefined,
          name: selectedTechnician.name || '',
          mobile_number: selectedTechnician.mobile_number || '',
          distributorId: distributorId,
          dealerId: selectedTechnician.userParentType === 'dealer' ? selectedTechnician.userParentId : null,
        });
      }
    }
  }, [technicianId, technician, form, dealerDrop, distributorDrop, user]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    form.setFieldsValue({ distributorId: null, dealerId: null });
    setFilteredDealers([]);
  };

  const handleDistributorChange = (value) => {
    const dealers = dealerDrop.filter((d) => d.distributorId === value);
    setFilteredDealers(dealers);
    form.setFieldsValue({ dealerId: null });
  };

  const onFinish = async (values) => {
    let userParentType = '';
    let userParentId = '';

    if (!isEditing) {
      if (userType === 'Admin') {
        userParentType = 'admin';
        userParentId = user._id;
      } else if (userType === 'Distributor') {
        userParentType = 'distributor';
        userParentId = values.distributorId;
      } else if (userType === 'Dealer') {
        userParentType = 'dealer';
        userParentId = values.dealerId;
      }
    }

    const basePayload = {
      name: values.name || '',
      mobile_number: values.mobile_number || '',
    };

    try {
      if (isEditing) {
        await dispatch(updateTechnician({ technicianId, data: basePayload })).unwrap();
      } else {
        const fullPayload = {
          ...basePayload,
          userRole: 'technician',
          userParentType,
          userParentId,
        };
        await dispatch(addTechnician(fullPayload)).unwrap();
      }
      navigate('/technician');
    } catch (err) {
      message.error(err || 'Failed to save technician');
    }
  };

  return (
<div className="!relative bg-[#f8f8f8]">
      <div className="!p-3 !m-4 !pb-10">
    {/* Header */}
    <Row align="middle" className="mb-8">
      <Col>
        <Button
          type="text"
          icon={<Icons.ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="!mr-3"
        />
      </Col>
      <Col>
        <Title level={3} className="!m-0 text-gray-800 font-semibold">
          {isEditing ? 'Edit Technician' : 'Add Technician'}
        </Title>
      </Col>
    </Row>

    {/* Loader or Form */}
    {loading && isEditing ? (
      <div className="flex items-center justify-center h-[60vh]">
        <Spin tip="Loading..." />
      </div>
    ) : (
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-8"
        initialValues={{ userType: 'Admin' }}
      >
        {/* ───── User Type Section ───── */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 hover:shadow-md transition-all ml-0 mr-[30%]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Type
          </h3>
          <CustomInput
            type="radio"
            name="userType"
            label=""
            value={userType}
            onChange={handleUserTypeChange}
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Distributor', value: 'Distributor' },
              { label: 'Dealer', value: 'Dealer' },
            ]}
            rules={[{ required: true, message: 'Please select a user type' }]}
            disabled={isEditing}
          />
        </div>

        {/* ───── User Information Section ───── */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-md transition-all ml-0 mr-[30%] mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Technician Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userType === 'Admin' && (
              <CustomInput
                type="text"
                name="userName"
                label="User Name"
                placeholder="Enter User Name"
                value={user?.name || ''}
                disabled
              />
            )}

            {(userType === 'Distributor' || userType === 'Dealer') && (
              <CustomInput
                type="select"
                name="distributorId"
                label="Distributor"
                placeholder="Select Distributor"
                options={distributorDrop.map((d) => ({
                  label: d.name,
                  value: d._id,
                }))}
                onChange={handleDistributorChange}
                rules={[{ required: !isEditing, message: 'Please select a distributor' }]}
                disabled={isEditing}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            )}

            {userType === 'Dealer' && (
              <CustomInput
                type="select"
                name="dealerId"
                label="Dealer"
                placeholder="Select Dealer"
                options={filteredDealers.map((d) => ({
                  label: d.name,
                  value: d._id,
                }))}
                rules={[{ required: !isEditing, message: 'Please select a dealer' }]}
                disabled={isEditing}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            )}

            <CustomInput
              type="text"
              name="name"
              label="Name"
              placeholder="Enter name"
              rules={[{ required: true, message: 'Please enter name' }]}
            />

            <CustomInput
              type="text"
              name="mobile_number"
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              maxLength={10}
              rules={[
                { required: true, message: 'Please enter Mobile Number' },
                { pattern: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' },
              ]}
            />
          </div>
        </div>
      </Form>
    )}
  </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()} loading={postLoading}>
          {isEditing ? 'Update Technician' : 'Save Technician'}
        </Button>
        <Button onClick={() => navigate('/technician')}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddTechnician;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
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
        setSelectedDistributor(null);
        setFilteredDealers([]);

        let distributorId = null;
        if (selectedTechnician.userParentType === 'distributor') {
          distributorId = selectedTechnician.userParentId;
          setSelectedDistributor(selectedTechnician.userParentId);
        } else if (selectedTechnician.userParentType === 'dealer') {
          const dealer = dealerDrop.find((d) => d._id === selectedTechnician.userParentId);
          distributorId = dealer ? dealer.distributorId : null;
          setSelectedDistributor(distributorId);
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
    setSelectedDistributor(null);
    setFilteredDealers([]);
  };

  const handleDistributorChange = (value) => {
    setSelectedDistributor(value);
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
        message.success('Technician updated successfully');
      } else {
        const fullPayload = {
          ...basePayload,
          userRole: 'technician',
          userParentType,
          userParentId,
        };
        await dispatch(addTechnician(fullPayload)).unwrap();
        message.success('Technician added successfully');
      }
      navigate('/technician');
    } catch (err) {
      message.error(err || 'Failed to save technician');
    }
  };

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        {/* Header */}
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {isEditing ? 'Edit Technician' : 'Add Technician'}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && isEditing ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-6 md:p-8 min-h-[70vh]"
            initialValues={{ userType: 'Admin' }}
          >
            <div className="gap-4">
              {/* User Type Selection */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <CustomInput
                  type="radio"
                  name="userType"
                  label="User Type"
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
                <div className="my-4"></div>
              </div>

              {/* Admin only: User Name */}
              <div className="grid grid-cols-3 gap-4">
                {userType === 'Admin' && (
                  <div>
                    <CustomInput
                      type="text"
                      name="userName"
                      label="User Name"
                      placeholder="Enter User Name"
                      value={user?.name || ''}
                      disabled
                    />
                  </div>
                )}
                {(userType === 'Distributor' || userType === 'Dealer') && (
                  <div>
                    <Form.Item
                      name="distributorId"
                      label="Select Distributor"
                      rules={[{ required: !isEditing, message: 'Please select a distributor' }]}
                    >
                      <Select
                        placeholder="Choose Distributor"
                        onChange={handleDistributorChange}
                        options={distributorDrop.map((d) => ({
                          label: d.name,
                          value: d._id,
                        }))}
                        disabled={isEditing}
                      />
                    </Form.Item>
                  </div>
                )}
                {userType === 'Dealer' && (
                  <div>
                    <Form.Item
                      name="dealerId"
                      label="Select Dealer"
                      rules={[{ required: !isEditing, message: 'Please select a dealer' }]}
                    >
                      <Select
                        placeholder="Choose Dealer"
                        options={filteredDealers.map((d) => ({
                          label: d.name,
                          value: d._id,
                        }))}
                        disabled={isEditing}
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <CustomInput
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="Enter name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                  />
                </div>
                <div>
                  <CustomInput
                    type="text"
                    name="mobile_number"
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    maxLength={10}
                    rules={[
                      { required: true, message: 'Please enter Mobile Number' },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: 'Mobile number must be 10 digits',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Card>

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
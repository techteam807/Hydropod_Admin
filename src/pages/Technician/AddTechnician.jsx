import { Button, Card, Col, Form, Radio, Row, Select, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from "../../component/commonComponent/CustomInput";
import { useNavigate, useParams } from 'react-router-dom';
import Icons from '../../assets/icon';
import { getDealerDropdown } from '../../redux/slice/dealer/dealerSlice';
import { getDistributorDropdown } from '../../redux/slice/distributor/distributorSlice';
import { addTechnician } from '../../redux/slice/technician/technicianSlice';


const { Title } = Typography;

const AddTechnician = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { technicianId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { user } = useSelector((state) => state.auth);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [filteredDealers, setFilteredDealers] = useState([]);

  console.log("user", user.name);

  const { distributorById, loading, postLoading } = useSelector(
    (state) => state.technician
  );

  const [userType, setUserType] = useState("Admin");

  const { distributorDrop } = useSelector((state) => state.distributor);

  const { dealerDrop } = useSelector((state) => state.dealer);

  useEffect(() => {
    if (userType === "Distributor") {
      dispatch(getDistributorDropdown());
    } else if (userType === "Dealer") {
      dispatch(getDealerDropdown());
    }
    form.setFieldsValue({
      userName: user?.name || "",
      distributorId: null,
      dealerId: null,
    });
  }, [userType, dispatch, form]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };


  // useEffect(() => {
  //   if (technicianId) {
  //     dispatch(getDistributorById({ technicianId }));
  //   }
  // }, [technicianId, dispatch]);

  // useEffect(() => {
  //   if (technicianId && distributorById) {
  //     form.setFieldsValue({
  //       name: distributorById?.distributor?.name || "",
  //       mobile_number: distributorById?.distributor?.mobile_number || "",
  //       userRole: distributorById?.distributor?.userRole || "",
  //       userParentType: distributorById?.distributor?.userParentType || "",
  //     });
  //   }
  // }, [technicianId, distributorById, form]);

  const handleDistributorChange = (value) => {
    setSelectedDistributor(value);
    const dealers = dealerDrop.filter((d) => d.distributorId === value);
    setFilteredDealers(dealers);
    form.setFieldsValue({ dealerId: null });
  };

  const onFinish = async (values) => {
    let userParentType = "";
    let userParentId = "";

    if (userType === "Admin") {
      userParentType = "admin";
      userParentId = user._id;
      userParentId = values.userName;
    } else if (userType === "Distributor") {
      userParentType = "distributor";
      userParentId = values.distributorId;
    } else if (userType === "Dealer") {
      userParentType = "dealer";
      userParentId = values.dealerId;
    }

    const payload = {
      name: values.name || "",
      mobile_number: values.mobile_number || "",
      userRole: "technician",
      userParentType,
      userParentId,
    };

    try {
      if (technicianId) {
        // await dispatch(update({ id: technicianId, data: payload })).unwrap();
        navigate(-1);
      } else {
        await dispatch(addTechnician(payload)).unwrap();
        navigate(-1);
      }
    } catch (err) {
      message.error(err);
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
              {technicianId ? "Edit Technician" : "Add Technician"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && technicianId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-6 md:p-8 min-h-[70vh]"
            initialValues={{ userType: "Admin" }}
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
                    { label: "Admin", value: "Admin" },
                    { label: "Distributor", value: "Distributor" },
                    { label: "Dealer", value: "Dealer" },
                  ]}
                  rules={[{ required: true, message: "Please select a user type" }]}
                />
                <div className="my-4"></div>
              </div>

              {/* Admin only: User Name */}
              <div>
              <div className='grid grid-cols-3 gap-4'>
              {userType === "Admin" && (
                <div>
                  <CustomInput
                    type="text"
                    name="userName"
                    label="User Name"
                    placeholder="Enter User Name"
                    value={user?.name || ""}
                    disabled
                  />
                </div>
              )}
                {(userType === "Distributor" || userType === "Dealer") && (
                <div>
                  <Form.Item
                    name="distributorId"
                    label="Select Distributor"
                    rules={[{ required: true, message: "Please select a distributor" }]}
                  >
                    <Select
                      placeholder="Choose Distributor"
                      onChange={handleDistributorChange}
                      options={distributorDrop.map((d) => ({
                        label: d.name,
                        value: d._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              )}
              {userType === "Dealer" && (
                <div>
                  <Form.Item
                    name="dealerId"
                    label="Select Dealer"
                    rules={[{ required: true, message: "Please select a dealer" }]}
                  >
                    <Select
                      placeholder="Choose Dealer"
                      options={filteredDealers.map((d) => ({
                        label: d.name,
                        value: d._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              )}
              </div>
              <div className='grid grid-cols-3 gap-4'>
               <div>
                <CustomInput
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  rules={[{ required: true, message: "Please enter name" }]}
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
                    { required: true, message: "Please enter Mobile Number" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Mobile number must be 10 digits",
                    },
                  ]}
                />
              </div>
              </div>
              </div>
            </div>
          </Form>

        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : technicianId ? (
            "Update Technician"
          ) : (
            "Save Technician"
          )}
        </Button>
        <Button onClick={() => navigate("/technician")}>Cancel</Button>
      </div>
    </div>
  )
}

export default AddTechnician

import { Button, Card, Col, Form, Row, Spin, Typography } from 'antd';
import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addDealer, getDealerById } from '../../redux/slice/dealer/dealerSlice';
import { useEffect } from 'react';
import Icons from '../../assets/icon';
import CustomInput from '../../component/commonComponent/CustomInput';
import { getDistributorDropdown } from '../../redux/slice/distributor/distributorSlice';


const { Title } = Typography;

function AddDealer() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dealerId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { distributorDrop } = useSelector(
    (state) => state.distributor
  );

  const { dealerById, loading, postLoading } = useSelector(
    (state) => state.dealer
  );

  useEffect(() => {
    dispatch(getDistributorDropdown())
  }, [dispatch])

  useEffect(() => {
    if (dealerId) {
      dispatch(getDealerById({ dealerId }));
    }
  }, [dealerId, dispatch]);

  useEffect(() => {
    if (dealerId && dealerById) {
      form.setFieldsValue({
        distributorId: dealerById?.dealer?.distributorId || null,
        company_name: dealerById?.dealer?.company_name || "",
        name: dealerById?.dealer?.name || "",
        email: dealerById?.dealer?.email || "",
        mobile_number: dealerById?.dealer?.mobile_number || "",
        address: dealerById?.dealer?.address || "",
        city: dealerById?.dealer?.city || "",
        state: dealerById?.dealer?.state || "",
        country: dealerById?.dealer?.country || "",
      });
    }
  }, [dealerId, dealerById, form]);

  const onFinish = async (values) => {
    const payload = {
      distributorId: values.distributorId,
      company_name: values.company_name,
      name: values.name,
      email: values.email,
      mobile_number: values.mobile_number,
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
    };
    try {
      if (dealerId) {
        // await dispatch(update({ id: dealerId, data: payload })).unwrap();
        navigate(-1);
      } else {
        await dispatch(addDealer(payload)).unwrap();
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
              {dealerId ? "Edit Dealer" : "Add Dealer"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && dealerId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="min-h-[70vh] !px-2"
          >
            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="distributorId"
                  label="Distributor Name"
                  placeholder="Select Distributor name"
                  options={distributorDrop.map((d) => ({
                    label: d.distributorId || d.name,
                    value: d._id,
                  }))}
                  rules={[{ required: true, message: "Please select Distributor" }]}
                  disabled={dealerId}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="company_name"
                  label="Company Name"
                  placeholder="Enter Company name"
                  rules={[{ required: true, message: "Please enter Company name" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  rules={[{ required: true, message: "Please enter name" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  rules={[{ required: true, message: "Please enter email" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="mobile_number"
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  rules={[{ required: true, message: "Please enter Mobile Number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Mobile number must be digits",
                  },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="address"
                  label="Address"
                  placeholder="Enter Address"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="city"
                  label="City"
                  placeholder="Enter City"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="state"
                  label="State"
                  placeholder="Enter State"
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="country"
                  label="Country"
                  placeholder="Enter Country"
                />
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : dealerId ? (
            "Update Dealer"
          ) : (
            "Save Dealer"
          )}
        </Button>
        <Button onClick={() => navigate("/dealer")}>Cancel</Button>
      </div>
    </div>
  )
}

export default AddDealer
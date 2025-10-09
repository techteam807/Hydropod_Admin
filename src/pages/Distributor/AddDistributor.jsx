import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Typography,
  message,
  Modal,
  Input,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { addDistributor, getDistributorById } from "../../redux/slice/distributor/distributorSlice";
import { indiaCities } from "../../constants/cities";

const { Title } = Typography;
const AddDistributor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { distributorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { distributorById, loading, postLoading } = useSelector(
    (state) => state.distributor
  );

  useEffect(() => {
    if (distributorId) {
      dispatch(getDistributorById({ distributorId }));
    }
  }, [distributorId, dispatch]);

  useEffect(() => {
    if (distributorId && distributorById) {
      form.setFieldsValue({
        company_name: distributorById?.distributor?.company_name || "",
        name: distributorById?.distributor?.name || "",
        email: distributorById?.distributor?.email || "",
        mobile_number: distributorById?.distributor?.mobile_number || "",
        address: distributorById?.distributor?.address || "",
        city: distributorById?.distributor?.city || "",
        state: distributorById?.distributor?.state || "",
        country: distributorById?.distributor?.country || "",
      });
    }
  }, [distributorId, distributorById, form]);

  const onFinish = async (values) => {
    const payload = {
      company_name: values.company_name || "",
      name: values.name || "",
      email: values.email || "",
      mobile_number: values.mobile_number || "",
      address: {
        line1: values.address?.line1,
        line2: values.address?.line2,
        city: values.address?.city,
        state: values.address?.state,
      },
    };
    try {
      if (distributorId) {
        // await dispatch(update({ id: distributorId, data: payload })).unwrap();
        navigate(-1);
      } else {
        await dispatch(addDistributor(payload)).unwrap();
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
              {distributorId ? "Edit Distributor" : "Add Distributor"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && distributorId ? (
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
            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                type="text"
                name="company_name"
                label="Company Name"
                placeholder="Enter Company name"
                rules={[{ required: true, message: "Please enter Company name" }]}
              />
              <CustomInput
                type="text"
                name="name"
                label="Name"
                placeholder="Enter name"
                rules={[{ required: true, message: "Please enter name" }]}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                type="text"
                name="email"
                label="Email"
                placeholder="Enter email"
                rules={[{ required: true, message: "Please enter email" }]}
              />
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
            </div>
            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                type="textarea"
                name={["address", "line1"]}
                label="Address"
                placeholder="Street 1"
              // rules={[{ required: true, message: "Please enter Address Line 1" }]}
              />
              <CustomInput
                type="textarea"
                name={["address", "line2"]}
                label="Address"
                placeholder="Street 2"
              // rules={[{ required: true, message: "Please enter Address Line 2" }]}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                type="select"
                name={["address", "city"]}
                label="City"
                placeholder="Select City"
                options={indiaCities.map((city) => ({ label: city, value: city }))}
                showSearch={true} // makes the dropdown searchable
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
              <CustomInput
                type="text"
                name={["address", "state"]}
                label="State"
                placeholder="Enter State"
              />
            </div>
          </Form>
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : distributorId ? (
            "Update Distributor"
          ) : (
            "Save Distributor"
          )}
        </Button>
        <Button onClick={() => navigate("/distributor")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddDistributor;

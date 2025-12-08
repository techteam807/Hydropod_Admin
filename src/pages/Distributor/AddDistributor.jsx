import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Spin, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
  addDistributor,
  getDistributorById,
  updateDistributor,
} from "../../redux/slice/distributor/distributorSlice";
import { stateSelectionOptions } from "../../constants/cities";
import { CopyOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const AddDistributor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { distributorId } = useParams();
  const [showOtherAddress, setShowOtherAddress] = useState(false);

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
        office_address: {
          line1: distributorById?.distributor?.office_address?.line1 || "",
          line2: distributorById?.distributor?.office_address?.line2 || "",
          city: distributorById?.distributor?.office_address?.city || "",
          state: distributorById?.distributor?.office_address?.state || "",
          pincode: distributorById?.distributor?.office_address?.pincode || "",
        },
        wareHouse_address: {
          line1: distributorById?.distributor?.wareHouse_address?.line1 || "",
          line2: distributorById?.distributor?.wareHouse_address?.line2 || "",
          city: distributorById?.distributor?.wareHouse_address?.city || "",
          state: distributorById?.distributor?.wareHouse_address?.state || "",
          pincode: distributorById?.distributor?.wareHouse_address?.pincode || "",
        },
        other_address: {
          line1: distributorById?.distributor?.other_address?.line1 || "",
          line2: distributorById?.distributor?.other_address?.line2 || "",
          city: distributorById?.distributor?.other_address?.city || "",
          state: distributorById?.distributor?.other_address?.state || "",
          pincode: distributorById?.distributor?.other_address?.pincode || "",
        },
        msme_number: distributorById?.distributor?.msme_number,
        gst_number: distributorById?.distributor?.gst_number,
        additional_notes: distributorById?.distributor?.additional_notes,
        terms_conditions: distributorById?.distributor?.terms_conditions,
      });
    }
  }, [distributorId, distributorById, form]);

  const onFinish = async (values) => {
    const payload = {
      company_name: values.company_name || "",
      name: values.name || "",
      gst_number: values?.gst_number,
      msme_number: values?.msme_number,
      email: values.email || "",
      mobile_number: values.mobile_number || "",
      office_address: {
        line1: values.office_address?.line1,
        line2: values.office_address?.line2,
        city: values.office_address?.city,
        state: values.office_address?.state,
        pincode: values.office_address?.pincode,
      },
      wareHouse_address: {
        line1: values.wareHouse_address?.line1,
        line2: values.wareHouse_address?.line2,
        city: values.wareHouse_address?.city,
        state: values.wareHouse_address?.state,
        pincode: values.wareHouse_address?.pincode,
      },
      ...(showOtherAddress && {
        other_address: {
          line1: values.other_address?.line1,
          line2: values.other_address?.line2,
          city: values.other_address?.city,
          state: values.other_address?.state,
          pincode: values.other_address?.pincode,
        },
      }),
      additional_notes: values?.additional_notes,
      terms_conditions: values?.terms_conditions,
    };
    try {
      if (distributorId) {
        await dispatch(
          updateDistributor({ distributorId, data: payload })
        ).unwrap();
        navigate(-1);
      } else {
        await dispatch(addDistributor(payload)).unwrap();
        navigate(-1);
      }
    } catch (err) {
      message.error(err);
    }
  };

  const copyOfficeToWarehouse = () => {
    const officeAddress = form.getFieldValue("office_address");

    if (officeAddress) {
      form.setFieldsValue({
        wareHouse_address: {
          line1: officeAddress.line1 || "",
          line2: officeAddress.line2 || "",
          city: officeAddress.city || "",
          state: officeAddress.state || "",
          pincode: officeAddress.pincode || "",
        },
      });
    }
  };


  return (
    <div className="!relative bg-[#f8f8f8]">
      <div className="!p-3 !m-4 !pb-10">
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
            className="min-h-[70vh] w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%] ">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <CustomInput
                  type="text"
                  name="gst_number"
                  label="GST Number"
                  placeholder="Enter GST Number"
                  rules={[{ required: true, message: "Please enter GST Number" }]}
                />
                  <CustomInput
                  type="text"
                  name="msme_number"
                  label="MSME Number"
                  placeholder="Enter MSME Number"
                />
              </div>
            </div>
            {/* ------------------ Contact Information ------------------ */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration- ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  rules={[
                    { required: true, message: "Please enter Mobile Number" },
                    { pattern: /^[0-9]{10}$/, message: "Mobile number must be digits" },
                  ]}
                />
              </div>
            </div>

            {/* ------------------ Address Section ------------------ */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%] md-8">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Office Address</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <CustomInput
                  type="text"
                  name={["office_address", "line1"]}
                  label="Address"
                  placeholder="Street 1"
                  className="w-full"
                  rules={[{ required: true, message: "Please enter Address" }]}
                />
                <CustomInput
                  type="text"
                  name={["office_address", "line2"]}
                  placeholder="Street 2"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <CustomInput
                  type="select"
                  name={["office_address", "state"]}
                  label="State"
                  placeholder="Select State"
                  options={stateSelectionOptions?.map((state) => ({
                    label: state.label,
                    value: state.value,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  rules={[{ required: true, message: "Please select State" }]}
                />
                <CustomInput
                  type="text"
                  name={["office_address", "city"]}
                  label="City"
                  placeholder="Enter City Name"
                  rules={[{ required: true, message: "Please Enter City" }]}
                />
                <CustomInput
                  type="text"
                  name={["office_address", "pincode"]}
                  label="Pincode"
                  placeholder="Enter Pincode"
                  rules={[{ required: true, message: "Please Enter Pincode" }]}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4 w-full justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Warehouse Address</h3>

                <Button
                  type="link"
                  icon={<CopyOutlined className="text-[12px]" />}
                  onClick={copyOfficeToWarehouse}
                >
                  Copy Office Address
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <CustomInput
                  type="text"
                  name={["wareHouse_address", "line1"]}
                  label="Address"
                  placeholder="Street 1"
                  className="w-full"
                  rules={[{ required: true, message: "Please enter Address" }]}
                />
                <CustomInput
                  type="text"
                  name={["wareHouse_address", "line2"]}
                  placeholder="Street 2"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <CustomInput
                  type="select"
                  name={["wareHouse_address", "state"]}
                  label="State"
                  placeholder="Select State"
                  options={stateSelectionOptions?.map((state) => ({
                    label: state.label,
                    value: state.value,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  rules={[{ required: true, message: "Please select State" }]}
                />
                <CustomInput
                  type="text"
                  name={["wareHouse_address", "city"]}
                  label="City"
                  placeholder="Enter City Name"
                  rules={[{ required: true, message: "Please Enter City" }]}
                />
                <CustomInput
                  type="text"
                  name={["wareHouse_address", "pincode"]}
                  label="Pincode"
                  placeholder="Enter Pincode"
                  rules={[{ required: true, message: "Please Enter Pincode" }]}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="link"
                  icon={
                    showOtherAddress ? (
                      <MinusCircleOutlined className="text-[12px]" />
                    ) : (
                      <PlusCircleOutlined className="text-[12px]" />
                    )
                  }
                  onClick={() => setShowOtherAddress(!showOtherAddress)}
                >
                  {showOtherAddress ? "Remove Other Address" : "Add Other Address"}
                </Button>
              </div>

            </div>

            {showOtherAddress && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Other Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <CustomInput
                    type="text"
                    name={["other_address", "line1"]}
                    label="Address"
                    placeholder="Street 1"
                    className="w-full"
                  />
                  <CustomInput
                    type="text"
                    name={["other_address", "line2"]}
                    placeholder="Street 2"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <CustomInput
                    type="select"
                    name={["other_address", "state"]}
                    label="State"
                    placeholder="Select State"
                    options={stateSelectionOptions?.map((state) => ({
                      label: state.label,
                      value: state.value,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                  <CustomInput
                    type="text"
                    name={["other_address", "city"]}
                    label="City"
                    placeholder="Enter City Name"
                  />
                  <CustomInput
                    type="text"
                    name={["other_address", "pincode"]}
                    label="Pincode"
                    placeholder="Enter Pincode"
                  />
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Other Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  type="textarea"
                  name="terms_conditions"
                  label="Terms & Conditions"
                  placeholder="Enter Terms & Conditions"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />

                <CustomInput
                  type="textarea"
                  name="additional_notes"
                  label="Additional Notes"
                  placeholder="Enter any additional notes"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </div>
            </div>


          </Form>

        )}
      </div>

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

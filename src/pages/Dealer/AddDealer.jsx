import { useEffect } from "react";
import { Button, Form, Row, Col, Spin, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDealer,
  getDealerById,
  updateDealer,
} from "../../redux/slice/dealer/dealerSlice";
import Icons from "../../assets/icon";
import CustomInput from "../../component/commonComponent/CustomInput";
import { getDistributorDropdown } from "../../redux/slice/distributor/distributorSlice";
import { stateSelectionOptions } from "../../constants/cities";

const { Title } = Typography;

function AddDealer() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dealerId } = useParams();

  const { distributorDrop } = useSelector((state) => state.distributor);
  const { dealerById, loading, postLoading } = useSelector(
    (state) => state.dealer
  );

  useEffect(() => {
    dispatch(getDistributorDropdown());
  }, [dispatch]);

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
        address: {
          line1: dealerById?.dealer?.address?.line1 || "",
          line2: dealerById?.dealer?.address?.line2 || "",
          city: dealerById?.dealer?.address?.city || "",
          state: dealerById?.dealer?.address?.state || "",
          pincode: dealerById?.dealer?.address?.pincode || "",
        },
        msme_number: dealerById?.dealer?.msme_number,
        gst_number: dealerById?.dealer?.gst_number,
        additional_notes: dealerById?.dealer?.additional_notes,
        terms_conditions: dealerById?.dealer?.terms_conditions,
      });
    }
  }, [dealerId, dealerById, form]);

  useEffect(() => {
    if (!dealerId && Array.isArray(distributorDrop) && distributorDrop.length) {
      const current = form.getFieldValue("distributorId");
      if (current) return; 
      const defaultDist = distributorDrop.find((d) => d.default === true);
      if (defaultDist) {
        form.setFieldsValue({ distributorId: defaultDist._id });
      }
    }
  }, [distributorDrop, dealerId, form]);

  const onFinish = async (values) => {
    const payload = {
      distributorId: values.distributorId,
      company_name: values.company_name,
      name: values.name,
      msme_number: values?.msme_number,
      gst_number: values?.gst_number,
      email: values.email,
      mobile_number: values.mobile_number,
      address: {
        line1: values.address?.line1,
        line2: values.address?.line2,
        city: values.address?.city,
        state: values.address?.state,
        pincode: values.address?.pincode,
      },
      additional_notes: values?.additional_notes,
      terms_conditions: values?.terms_conditions,
    };

    try {
      if (dealerId) {
        await dispatch(updateDealer({ dealerId, data: payload })).unwrap();
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
              {dealerId ? "Edit Dealer" : "Add Dealer"}
            </Title>
          </Col>
        </Row>

        {/* Loader */}
        {loading && dealerId ? (
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
            {/* Dealer Information */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Dealer Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CustomInput
                  type="select"
                  name="distributorId"
                  label="Distributor Name"
                  placeholder="Select Distributor name"
                  options={distributorDrop.map((d) => ({
                    label: d.distributorId || d.name,
                    value: d._id,
                  }))}
                  rules={[
                    { required: true, message: "Please select Distributor" },
                  ]}
                  disabled={dealerId}
                />
                <CustomInput
                  type="text"
                  name="company_name"
                  label="Company Name"
                  placeholder="Enter Company Name"
                  rules={[{ required: true, message: "Please enter Company Name" }]}
                />
                <CustomInput
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter Name"
                  rules={[{ required: true, message: "Please enter Name" }]}
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

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                  rules={[{ required: true, message: "Please enter Email" }]}
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

            {/* Address Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 mt-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <CustomInput
                  type="text"
                  name={["address", "line1"]}
                  label="Address Line 1"
                  placeholder="Street 1"
                  rules={[{ required: true, message: "Please enter Address Line 1" }]}
                />
                <CustomInput
                  type="text"
                  name={["address", "line2"]}
                  placeholder="Street 2 (optional)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <CustomInput
                  type="select"
                  name={["address", "state"]}
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
                  name={["address", "city"]}
                  label="City"
                  placeholder="Enter City"
                  rules={[{ required: true, message: "Please enter City" }]}
                />
                <CustomInput
                  type="text"
                  name={["address", "pincode"]}
                  label="Pincode"
                  placeholder="Enter Pincode"
                  rules={[{ required: true, message: "Please enter Pincode" }]}
                />
              </div>
            </div>

            {/* Other Details */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-all duration-300 ml-0 mr-[30%]">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Other Details
                </h3>
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

      {/* Bottom Action Buttons */}
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
  );
}

export default AddDealer;

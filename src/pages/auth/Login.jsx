import React from "react";
import { Row, Col, Card, Form, Button, Typography } from "antd";
import CustomInput from "../../component/commonComponent/CustomInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/auth/authSlice";
import logo from "../../assets/Hydropod_Logo_White.png";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);
  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate("/home");
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Left Side - Branding */}
      <Col
        span={12}
        className="rounded-r-xl p-8"
        style={{
          backgroundColor: "#1785b6",
          color: "#fff",
        }}
      >
        <div className="flex flex-col items-start justify-between h-full pb-7">
          <div>
            <img src={logo} className="w-44" alt="Hydropod" />
          </div>
          <div className="ps-3">
            <Title className="!mb-2" style={{ color: "#fff" }}>
              Welcome to Hydropod
            </Title>
            <Text className="!text-base" style={{ color: "#fff" }}>
              Login to access your control panel.
            </Text>
          </div>
        </div>
      </Col>

      <Col
        span={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          title="Login"
          style={{ width: 400 }}
          className="!shadow !text-center"
        >
          <Form
            form={form}
            layout="vertical"
            className="!py-5 !px-4"
            onFinish={onFinish}
          >
            <CustomInput
              type="text"
              name="email"
              label="Email"
              placeholder="Enter your email"
              rules={[{ required: true, message: "Email is required" }]}
            />

            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              rules={[{ required: true, message: "Password is required" }]}
            />

            <Form.Item className="!pt-2">
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

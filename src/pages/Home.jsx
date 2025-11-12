import React, { useEffect } from "react";
import { Row, Col, Typography, Spin, Card, Divider } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCount } from "../redux/slice/technician/technicianSlice";

const { Title, Text } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const { count, loading } = useSelector((state) => state.technician);

  useEffect(() => {
    dispatch(getCount());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Distributors",
      value: count?.distributor || 0,
      icon: (
        <div className="bg-blue-100 p-4 rounded-xl">
          <TeamOutlined style={{ fontSize: 34, color: "#1677ff" }} />
        </div>
      ),
      accent: "border-blue-500 bg-blue-50/40",
    },
    {
      title: "Total Dealers",
      value: count?.dealer || 0,
      icon: (
        <div className="bg-purple-100 p-4 rounded-xl">
          <UserOutlined style={{ fontSize: 34, color: "#722ed1" }} />
        </div>
      ),
      accent: "border-purple-500 bg-purple-50/40",
    },
    {
      title: "Total Technicians",
      value: count?.technician || 0,
      icon: (
        <div className="bg-green-100 p-4 rounded-xl">
          <ToolOutlined style={{ fontSize: 34, color: "#52c41a" }} />
        </div>
      ),
      accent: "border-green-500 bg-green-50/40",
    },
  ];

  if (loading || !count) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 md:px-12 py-10">
      <div className="text-center mb-12">
        <Title level={2} className="!text-gray-800 font-semibold mb-1">
          Dashboard Overview
        </Title>
        <Text className="text-gray-500">
          Insight into your business network and technical workforce
        </Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {stats.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              className={`rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${item.accent} border-l-[6px]`}
              bodyStyle={{ padding: "28px" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    {item.title}
                  </Text>
                  <Title
                    level={2}
                    className="!m-0 !text-gray-800 font-bold leading-tight"
                  >
                    {item.value.toLocaleString()}
                  </Title>
                  <Text className="text-xs text-gray-400 mt-2 block">
                    Updated just now
                  </Text>
                </div>
                {item.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider className="my-12 border-gray-300" />

      <div className="bg-white rounded-2xl shadow-md p-8 text-center mx-auto max-w-4xl border border-gray-100">
        <Title level={4} className="!text-gray-700 mb-3">
          Welcome to Your Technician Dashboard
        </Title>
        <Text className="text-gray-500">
          Here you can track distributor, dealer, and technician statistics at a glance.
          Keep monitoring performance trends and make data-driven decisions.
        </Text>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div>
            <span className="block font-semibold text-gray-700 text-base">
              {count?.distributor + count?.dealer + count?.technician || 0}
            </span>
            Total Users
          </div>
          <div className="h-8 w-[1px] bg-gray-300"></div>
          <div>
            <span className="block font-semibold text-gray-700 text-base">
              {new Date().toLocaleDateString("en-GB")}
            </span>
            Current Date
          </div>
        </div>
      </div>

      {/* <footer className="text-center mt-16 text-gray-400 text-xs">
        © {new Date().getFullYear()} Technician Dashboard | Designed with 💡 by Your Team
      </footer> */}
    </div>
  );
};

export default Home;

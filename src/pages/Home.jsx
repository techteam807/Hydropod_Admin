import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { UserOutlined, TeamOutlined, ToolOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Home = () => {
  const stats = [
    {
      title: "Total Distributor",
      value: 1200,
      icon: <TeamOutlined style={{ fontSize: 30, color: "#1677ff" }} />,
    },
    {
      title: "Total Dealer",
      value: 3500,
      icon: <UserOutlined style={{ fontSize: 30, color: "#722ed1" }} />,
    },
    {
      title: "Total Technician",
      value: 124500,
      icon: <ToolOutlined style={{ fontSize: 30, color: "#52c41a" }} />,
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <Title level={3} className="mb-8 text-gray-800">
        Dashboard Overview
      </Title>

      <Row gutter={[24, 24]}>
        {stats.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              bordered
              className="rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary" className="text-base">
                    {item.title}
                  </Text>
                  <Title level={3} style={{ margin: "4px 0 0" }}>
                    {item.value.toLocaleString()}
                  </Title>
                </div>
                <div>{item.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;

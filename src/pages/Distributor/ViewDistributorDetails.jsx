import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  List,
  Typography,
  Button,
  Space,
  Spin,
} from "antd";
import { getDistributorById } from "../../redux/slice/distributor/distributorSlice";
import Icons from "../../assets/icon";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ViewDistributorDetails = () => {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { distributorById, loading } = useSelector((state) => state.distributor);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    dispatch(getDistributorById({ distributorId }));
  }, [distributorId, dispatch]);

  if (loading || !distributorById) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
        <Spin size="large" tip="Loading details..." />
      </div>
    );
  }

  const { distributor, creditionalUser, dealers, users } = distributorById || {};

  return (
    <div className="!relative bg-[#f8f8f8] min-h-screen">
      <div className="!p-3 !m-4 !pb-20">
        {/* ───── Header ───── */}
        <Row align="middle" className="mb-8 flex justify-between items-center">
          <Col className="flex items-center gap-3">
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            />
            <div>
              <Title level={3} className="!m-0 text-gray-800 font-semibold">
                Distributors, Dealers and Users
              </Title>
              <Text type="secondary">
                Browse the hierarchy in-place. No separate detail page.
              </Text>
            </div>
          </Col>
          <Col>
            <Button
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="rounded-lg shadow-sm"
            >
              Back
            </Button>
          </Col>
        </Row>

        {/* ───── Top Info Section ───── */}
        <div className="bg-white !rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 ">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            {/* Left: Distributor Basic Info */}
            <div>
              <div className="flex items-center gap-2">
                <Title level={5} className="!m-0">
                  {distributor?.name || "—"}
                </Title>
                <Tag color={distributor?.isActive ? "green" : "default"}>
                  {distributor?.isActive ? "Active" : "Inactive"}
                </Tag>
              </div>


              <div className="text-gray-500 pt-1">
                {distributor?.email} • {distributor?.mobile_number} •{" "}
                {distributor?.country || ""}
              </div>
            </div>

            {/* Middle: Dealers and Users count */}
            <div className="text-gray-600 text-sm font-medium flex items-center gap-3 margin-right-4">
              <span className="bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                Dealers: <b>{dealers?.length || 0}</b>
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                Technician Users: <b>{users?.length || 0}</b>
              </span>
            </div>
          </div>
        </div>


        {/* ───── Distributor and Credential Info ───── */}
        <Row gutter={[24, 24]} align="stretch">
          {/* Distributor Details */}
         <Col xs={24} sm={12} md={12}>
            <Card
              title={<span className="font-semibold text-gray-800 !ps-2">Distributor Details</span>}
              bordered={false}
              className="!rounded-2xl shadow-sm border border-gray-100 h-full"
              bodyStyle={{ minHeight: "320px", padding: "1.25rem" }}
            >
              <div className="space-y-2 text-[15px] leading-relaxed">
                <div className="flex"><span className="font-medium w-28 text-gray-500">Name : </span> <span>{distributor?.name || "—"}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Company : </span> <span>{distributor?.company_name || "—"}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Email : </span> <span>{distributor?.email || "—"}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Mobile : </span> <span>{distributor?.mobile_number || "—"}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Country : </span> <span>{distributor?.country || "—"}</span></div>
                <div className="flex items-start">
                  <span className="font-medium w-28 text-gray-500 shrink-0">
                    Address :
                  </span>
                  <span className="flex-1 text-gray-800 break-words leading-relaxed">
                    {distributor?.address?.line1
                      ? `${distributor?.address?.line1}, ${distributor?.address?.city || ""}, ${distributor?.address?.state || ""}`
                      : "—"}
                  </span>
                </div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Created : </span> <span>{new Date(distributor?.createdAt).toLocaleString()}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Updated :  </span> <span>{new Date(distributor?.updatedAt).toLocaleString()}</span></div>
              </div>
            </Card>
          </Col>

          {/* Credential User */}
          <Col xs={24} sm={12} md={12}>
            <Card
              title={<span className="font-semibold text-gray-800 !ps-2">Credential User</span>}
              bordered={false}
              className="!rounded-2xl shadow-sm border border-gray-100 h-full"
              bodyStyle={{ minHeight: "320px", padding: "1.25rem" }}
            >
              <div className="space-y-2 text-[15px] leading-relaxed">
                <div className="flex"><span className="font-medium w-28 text-gray-500">Name : </span> <span>{creditionalUser?.name || "—"}</span></div>
                <div className="flex"><span className="font-medium w-28 text-gray-500">Email : </span> <span>{creditionalUser?.email || "—"}</span></div>
                <div className="flex items-center">
                  <span className="font-medium w-28 text-gray-500">Role : </span>
                  <Tag color="blue" className="ml-1">{creditionalUser?.userRole || "—"}</Tag>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28 text-gray-500">Status : </span>
                  <Tag color={creditionalUser?.isActive ? "green" : "default"} className="ml-1">
                    {creditionalUser?.isActive ? "Active" : "InActive"}
                  </Tag>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28 text-gray-500">Password :</span>
                  <span className="flex items-center gap-2">
                    {showPassword ? creditionalUser?.password : "*******"}
                    <span
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>


        {/* ───── Dealers and Users ───── */}
        <Row gutter={[24, 24]} className="mt-6" align="stretch">
          {/* Dealers Section */}
          <Col xs={24} sm={12} md={12}>
            <Card
              title={<span className="font-semibold text-gray-800 !ps-2">{`Dealers (${dealers?.length || 0})`}</span>}
              bordered={false}
              className="!rounded-2xl shadow-sm !border border-gray-100 h-full"
              bodyStyle={{ minHeight: "320px", padding: "1.25rem", display: "flex", flexDirection: "column" }}
            >
              <List
                itemLayout="vertical"
                dataSource={dealers}
                className="flex-1"
                locale={{ emptyText: "No dealers assigned." }}
                renderItem={(dealer) => (
                  <List.Item className="!border-b border-gray-100 last:border-none pb-3">
                    <div className="space-y-2 text-[15px] leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex"><span className="font-medium w-28 text-gray-500">Name : </span> <span>{dealer.name || "—"}</span></div>
                      </div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Status : </span>  <Tag color={dealer.isActive ? "green" : "default"}>
                        {dealer.isActive ? "Active" : "Inactive"}
                      </Tag>
                      </div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Email : </span> <span>{dealer.email || "—"}</span></div>
                      {/* <br /> */}
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Mobile : </span> <span>{dealer.mobile_number || "—"}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Address : </span> <span>{dealer.address?.city},{dealer.address?.state}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Created : </span> <span>{new Date(dealer.createdAt).toLocaleString()}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Updated : </span> <span>{new Date(dealer.updatedAt).toLocaleString()}</span></div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Users Section */}
          <Col xs={24} sm={12} md={12}>
            <Card
              title={<span className="font-semibold text-gray-800 !ps-2">{`Technician Users (${users?.length || 0})`}</span>}
              bordered={false}
              className="!rounded-2xl shadow-sm border border-gray-100 h-full"
              bodyStyle={{ minHeight: "300px", display: "flex", flexDirection: "column", padding: "1.25rem" }}
            >
              <List
                itemLayout="vertical"
                dataSource={users}
                className="flex-1"
                locale={{ emptyText: "No users available." }}
                renderItem={(user) => (
                  <List.Item className="!border-b border-gray-100 last:border-none pb-3">
                    <div className="space-y-2 text-[15px] leading-relaxed">
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Name : </span> <span>{user.name || "—"}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Role : </span> <Tag color="blue">{user.userRole}</Tag></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Status : </span> <Tag color={user.isActive ? "green" : "default"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Tag>
                      </div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Mobile : </span> <span>{user.mobile_number || "—"}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Created : </span> <span>{new Date(user.createdAt).toLocaleString()}</span></div>
                      <div className="flex"><span className="font-medium w-28 text-gray-500">Updated : </span> <span>{new Date(user.createdAt).toLocaleString()}</span></div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewDistributorDetails;

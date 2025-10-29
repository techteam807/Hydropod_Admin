import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Descriptions, Button, Spin } from "antd";
import { getDistributorById } from "../../redux/slice/distributor/distributorSlice";
import Icons from "../../assets/icon";

const ViewDistributorDetails = () => {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { distributorById, loading } = useSelector((state) => state.distributor);
    console.log("distributorById:",distributorById);
    
  useEffect(() => {
    dispatch(getDistributorById({ distributorId: distributorId }));
  }, [distributorId, dispatch]);

  if (loading || !distributorById) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const d = distributorById;

  return (
    <div className="m-4">
      <Card
        title={`Distributor Details - ${d.company_name}`}
        extra={
          <Button
            icon={<Icons.ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Company Name">{d.company_name}</Descriptions.Item>
          <Descriptions.Item label="Name">{d.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{d.email}</Descriptions.Item>
          <Descriptions.Item label="Mobile">{d.mobile_number}</Descriptions.Item>
          <Descriptions.Item label="State">{d.address?.state || "-"}</Descriptions.Item>
          <Descriptions.Item label="City">{d.address?.city || "-"}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {d.isActive ? "Active" : "Inactive"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ViewDistributorDetails;

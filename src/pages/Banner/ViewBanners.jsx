import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Space,
  Tag,
  Tabs,
  Modal,
  Image,
  message,
  Spin,
  Empty,
  Popconfirm,
} from "antd";
import Icons from "../../assets/icon";
import CustomTable from "../../component/commonComponent/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanners,
  addBanner,
  deleteBanner,
  editBanner,
} from "../../redux/slice/banner/bannerSlice";
const ViewBanners = () => {
  const dispatch = useDispatch();
  const { banner, loading, deleteLoading } = useSelector(
    (state) => state.banner
  );
  console.log("ban:", banner);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [bannerName, setBannerName] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [bannerImgName, setBannerImgName] = useState("");
  const [uploading, setUploading] = useState(false);
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    setUploading(true);
    setBannerImgName(file.name);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();
    setBannerImg(data.secure_url);
    setUploading(false);
  };

  const handleSave = () => {
    if (!bannerName || !bannerImg)
      return message.error("Please fill all fields");

    const formData = {
      Banner_Name: bannerName,
      Banner_Url: bannerImg,
    };

    if (editData) {
      dispatch(editBanner({ bannerId: editData._id, data: formData }));
      message.success("Banner Updated Successfully");
    } else {
      dispatch(addBanner(formData));
      message.success("Banner Added Successfully");
    }
    setOpenModal(false);
    setEditData(null);
    setBannerName("");
    setBannerImg("");

    setTimeout(() => dispatch(getBanners()), 300);
  };

  const columns = [
    { title: "Banner Name", dataIndex: "Banner_Name", key: "Banner_Name" },
    {
      title: "Image",
      dataIndex: "Banner_Url",
      key: "Banner_Url",
      render: (url) => (
        <div className="flex justify-center items-center">
          <Image
            src={url}
            width={112} // 28*4 = 112px (same as w-28)
            height={112}
            style={{
              objectFit: "cover",
              borderRadius: "0.5rem",
              border: "1px solid #d9d9d9",
            }}
            preview={{ mask: <div>Click to Preview</div> }}
          />
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Icons.EditOutlined />}
            onClick={() => {
              setEditData(record);
              setBannerName(record.Banner_Name);
              setBannerImg(record.Banner_Url);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this Banner?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: deleteLoading }}
            onConfirm={async () => {
              try {
                await dispatch(deleteBanner(record._id)).unwrap();
                dispatch(getBanners()); // refresh table
              } catch (err) {
                message.error(err || "Failed to delete banner");
              }
            }}
          >
            <Button
              type="default"
              size="small"
              danger
              icon={<Icons.DeleteOutlined />}
            >
              {" "}
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="m-4">
      <Card className="!mb-4">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-xl font-semibold">View Banners</div>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<Icons.PlusOutlined />}
              onClick={() => {
                setEditData(null);
                setBannerName("");
                setBannerImg("");
                setOpenModal(true);
              }}
            >
              Add Banner
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <CustomTable columns={columns} data={banner} />
        </Spin>
      </Card>

      <Modal
        title={editData ? "Edit Banner" : "Add Banner"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        centered
        width={500}
        bodyStyle={{ padding: "24px" }}
        destroyOnClose
      >
        <div className="flex flex-col gap-6">
          {/* Banner Name */}
          <div>
            <label
              htmlFor="banner-name"
              className="block text-sm font-medium mb-2"
            >
              Banner Name
            </label>
            <Input
              id="banner-name"
              placeholder="Enter banner name"
              value={bannerName}
              onChange={(e) => setBannerName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="banner-upload"
                className="cursor-pointer bg-transparent hover:bg-[#1886b5] hover:text-white py-2 px-4 rounded transition border text-[#1886b5] font-medium"
              >
                Choose File
              </label>
              <span className="text-gray-600 text-sm">
                {bannerImgName || "No file chosen"}
              </span>
            </div>
            <input
              id="banner-upload"
              type="file"
              className="hidden"
              onChange={uploadImage}
              accept="image/*"
            />
          </div>

          {/* Image Preview */}
          <Spin spinning={uploading}>
            <div className="mt-4 flex justify-center">
              {bannerImg ? (
                <img
                  src={bannerImg}
                  alt="Banner Preview"
                  className="w-52 h-52 sm:w-40 sm:h-40 object-cover rounded-lg border shadow hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-gray-400 border rounded-lg bg-gray-50">
                  No Preview
                </div>
              )}
            </div>
          </Spin>
        </div>
      </Modal>
    </div>
  );
};

export default ViewBanners;
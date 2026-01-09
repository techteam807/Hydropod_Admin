import { Button, Card, Col, Form, Radio, Row, Select, Spin, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../../component/commonComponent/CustomInput';
import { useNavigate, useParams } from 'react-router-dom';
import Icons from '../../assets/icon';
import { getDealerDropdown } from '../../redux/slice/dealer/dealerSlice';
import { getDistributorDropdown } from '../../redux/slice/distributor/distributorSlice';
import { addTechnician, getTechnician, updateTechnician } from '../../redux/slice/technician/technicianSlice';
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Upload, Modal, Avatar, Slider } from "antd";
import Cropper from "react-easy-crop";
const { Title } = Typography;

const AddTechnician = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { technicianId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const { technician, loading, postLoading } = useSelector((state) => state.technician);
  const [userType, setUserType] = useState('Admin');
  const { distributorDrop } = useSelector((state) => state.distributor);
  const { dealerDrop } = useSelector((state) => state.dealer);
  const isEditing = !!technicianId;
  const [tempPreview, setTempPreview] = useState(null);   // modal preview
  const [imagePreview, setImagePreview] = useState(null); // final avatar
  const [imageFile, setImageFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PROFILE_PRESET;
  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
       image.crossOrigin = "anonymous";
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
    });
  };
  useEffect(() => {
    if (technicianId) {
      dispatch(getTechnician({ limit: 100, page: 1 }));
    }
    if (userType === 'Distributor') {
      dispatch(getDistributorDropdown());
    } else if (userType === 'Dealer') {
      dispatch(getDealerDropdown());
    }
    if (!technicianId) {
      form.setFieldsValue({
        userName: user?.name || '',
        distributorId: null,
        dealerId: null,
      });
    }
  }, [userType, dispatch, form, technicianId, user]);

  useEffect(() => {
    if (technicianId && technician.length > 0 && distributorDrop.length > 0) {
      const selectedTechnician = technician.find((t) => t._id === technicianId);
      if (selectedTechnician) {
        const mappedUserType = selectedTechnician.userParentType === 'admin' ? 'Admin' :
          selectedTechnician.userParentType === 'distributor' ? 'Distributor' : 'Dealer';
        setUserType(mappedUserType);
        setFilteredDealers([]);

        let distributorId = null;
        if (selectedTechnician.userParentType === 'distributor') {
          distributorId = selectedTechnician.userParentId;
        } else if (selectedTechnician.userParentType === 'dealer') {
          const dealer = dealerDrop.find((d) => d._id === selectedTechnician.userParentId);
          distributorId = dealer ? dealer.distributorId : null;
          const dealers = dealerDrop.filter((d) => d.distributorId === distributorId);
          setFilteredDealers(dealers);
        }

        form.setFieldsValue({
          userType: mappedUserType,
          userName: selectedTechnician.userParentType === 'admin' ? user?.name || '' : undefined,
          name: selectedTechnician.name || '',
          mobile_number: selectedTechnician.mobile_number || '',
          distributorId: distributorId,
          dealerId: selectedTechnician.userParentType === 'dealer' ? selectedTechnician.userParentId : null,
        });
      }
    }
  }, [technicianId, technician, form, dealerDrop, distributorDrop, user]);

  useEffect(() => {
    if (
      !isEditing &&
      (userType === "Distributor" || userType === "Dealer") &&
      Array.isArray(distributorDrop) &&
      distributorDrop.length > 0
    ) {
      const currentDist = form.getFieldValue("distributorId");
      if (currentDist) return;
      const defaultDist = distributorDrop.find((d) => d.default === true);
      if (defaultDist) {
        form.setFieldsValue({ distributorId: defaultDist._id });
        const dealers = dealerDrop.filter(
          (d) => d.distributorId === defaultDist._id
        );
        setFilteredDealers(dealers);
        if (userType === "Dealer") {
          form.setFieldsValue({ dealerId: null });
        }
      }
    }
  }, [isEditing, userType, distributorDrop, dealerDrop, form]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    form.setFieldsValue({ distributorId: null, dealerId: null });
    setFilteredDealers([]);
  };

  const handleDistributorChange = (value) => {
    const dealers = dealerDrop.filter((d) => d.distributorId === value);
    setFilteredDealers(dealers);
    form.setFieldsValue({ dealerId: null });
  };

  const onFinish = async (values) => {
    let userParentType = '';
    let userParentId = '';
   
    if (!isEditing) {
      if (userType === 'Admin') {
        userParentType = 'admin';
        userParentId = user._id;
      } else if (userType === 'Distributor') {
        userParentType = 'distributor';
        userParentId = values.distributorId;
      } else if (userType === 'Dealer') {
        userParentType = 'dealer';
        userParentId = values.dealerId;
      }
    }
    
    const basePayload = {
      name: values.name || '',
      mobile_number: values.mobile_number || '',
    };

    try {
      if (isEditing) {
        await dispatch(updateTechnician({ technicianId, data: basePayload })).unwrap();
      } else {
        const fullPayload = {
          ...basePayload,
          userRole: 'technician',
          userParentType,
          userParentId,
          profile_picture: imageUrl || '',
        };
        await dispatch(addTechnician(fullPayload)).unwrap();
      }
      navigate('/technician');
    } catch (err) {
      message.error(err || 'Failed to save technician');
    }
  };
const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const fileInputRef = React.useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value IMMEDIATELY to allow re-uploading same file
    e.target.value = '';

    const base64 = await getBase64(file);
    setTempPreview(base64);
    setImagePreview(base64);
    setImageFile(file);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPreviewOpen(true);
  };

  const handleAvatarClick = () => {
    if (imagePreview) {
      setTempPreview(imagePreview);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setPreviewOpen(true);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setTempPreview(null);
    setImageFile(null);
    form.setFieldsValue({ profile_picture: null });
  };

const uploadImage = async (file) => {
  setUploading(true);
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );

  const data = await res.json();
  return data.secure_url;
};
  return (
    <div className="!relative bg-[#f8f8f8]">
      <div className="!p-3 !m-4 !pb-10">
        {/* Header */}
        <Row align="middle" className="mb-8">
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="!mr-3"
            />
          </Col>
          <Col>
            <Title level={3} className="!m-0 text-gray-800 font-semibold">
              {isEditing ? 'Edit Technician' : 'Add Technician'}
            </Title>
          </Col>
        </Row>

        {/* Loader or Form */}
        {loading && isEditing ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-8"
            initialValues={{ userType: 'Admin' }}
          >
            {/* ───── User Type Section ───── */}
            <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 hover:shadow-md transition-all ml-0 mr-[30%]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Type
              </h3>
              <CustomInput
                type="radio"
                name="userType"
                label=""
                value={userType}
                onChange={handleUserTypeChange}
                options={[
                  { label: 'Admin', value: 'Admin' },
                  { label: 'Distributor', value: 'Distributor' },
                  { label: 'Dealer', value: 'Dealer' },
                ]}
                rules={[{ required: true, message: 'Please select a user type' }]}
                disabled={isEditing}
              />
            </div>

            {/* ───── User Information Section ───── */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-md transition-all ml-0 mr-[30%] mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Technician Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {userType === 'Admin' && (
                  <CustomInput
                    type="text"
                    name="userName"
                    label="User Name"
                    placeholder="Enter User Name"
                    value={user?.name || ''}
                    disabled
                  />
                )}

                {(userType === 'Distributor' || userType === 'Dealer') && (
                  <CustomInput
                    type="select"
                    name="distributorId"
                    label="Distributor"
                    placeholder="Select Distributor"
                    options={distributorDrop.map((d) => ({
                      label: d.name,
                      value: d._id,
                    }))}
                    onChange={handleDistributorChange}
                    rules={[{ required: !isEditing, message: 'Please select a distributor' }]}
                    disabled={isEditing}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}

                {userType === 'Dealer' && (
                  <CustomInput
                    type="select"
                    name="dealerId"
                    label="Dealer"
                    placeholder="Select Dealer"
                    options={filteredDealers.map((d) => ({
                      label: d.name,
                      value: d._id,
                    }))}
                    rules={[{ required: !isEditing, message: 'Please select a dealer' }]}
                    disabled={isEditing}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )}

                <CustomInput
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  rules={[{ required: true, message: 'Please enter name' }]}
                />

                <CustomInput
                  type="text"
                  name="mobile_number"
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  rules={[
                    { required: true, message: 'Please enter Mobile Number' },
                    { pattern: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' },
                  ]}
                />
                <div> 
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Profile Image
                  </h3>
                                <div className="flex items-center gap-6">
                {/* Circle Preview */}
                <div className="relative inline-block cursor-pointer" onClick={handleAvatarClick}>
                  <Avatar
                    size={120}
                    src={imagePreview}
                    icon={!imagePreview && <UserOutlined />}
                    className="border border-gray-300 shadow-sm"
                  />

                  
                  {imagePreview && (
                    <div
                      onClick={handleRemoveImage}
                      className="
        absolute -top-2 -right-2
        bg-red-500 text-white
        rounded-full p-1
        cursor-pointer
        shadow-md
        hover:bg-red-600
      "
                    >
                      <DeleteOutlined style={{ fontSize: 14 }} />
                    </div>
                  )}
                </div>


                
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button icon={<PlusOutlined />} onClick={handleUploadClick}>
                  Upload Profile Image
                </Button>
               
              </div>
                            <Modal
                open={previewOpen}
                title="Set Profile Image"
                onCancel={() => setPreviewOpen(false)}
              onOk={async () => {
  if (!croppedAreaPixels) return;

  const croppedBlob = await getCroppedImg(tempPreview, croppedAreaPixels);
  const croppedFile = new File([croppedBlob], "profile.jpg", {
    type: "image/jpeg",
  });

  const url = await uploadImage(croppedFile);

  if (url) {
    setImageFile(croppedFile);
    setImagePreview(url);
    setImageUrl(url);
    setUploading(false);
    setPreviewOpen(false);
  }
}}

                okText={`${uploading ? 'Uploading...' : 'Set Profile Image'}`}
                width={420}
              >
                <div className="relative w-full h-[320px] bg-black rounded-lg overflow-hidden">
                  {tempPreview && (
                    <Cropper
                      image={tempPreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  )}
                </div>
                <div className="mt-4 px-2">
                  <Slider
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={setZoom}
                  />
                </div>
              </Modal>
                </div>
              </div>
            </div>
          </Form>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()} loading={postLoading}>
          {isEditing ? 'Update Technician' : 'Save Technician'}
        </Button>
        <Button onClick={() => navigate('/technician')}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddTechnician;
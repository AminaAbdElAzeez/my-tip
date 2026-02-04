import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  message,
  Descriptions,
  Tooltip,
  Modal,
  Button,
  Tag,
  Avatar,
  Image,
  Upload,
  Select,
  Form,
  Input,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

interface SocialMedia {
  social_media_id: number;
  social_media_name: string;
  social_media_image: string;
  url: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  type: number;
  status: number;
  is_active: boolean;
  is_phone_verified: boolean;
  active_notification: boolean;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  employee_position: string | null;
  socialMedia: SocialMedia[];
}

function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [data, setData] = useState<User[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<User | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  /* ================= Status Map ================= */

  // ================= Maps for localization =================
  const userStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'statusPending' }),
    2: intl.formatMessage({ id: 'statusActive' }),
    3: intl.formatMessage({ id: 'statusInactive' }),
    5: intl.formatMessage({ id: 'statusIncompleted' }),
    6: intl.formatMessage({ id: 'statusReject' }),
  };

  const userTypeMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'typeAdmin' }),
    2: intl.formatMessage({ id: 'typeEmployer' }),
    3: intl.formatMessage({ id: 'typeEmployee' }),
    4: intl.formatMessage({ id: 'typeCreator' }),
    5: intl.formatMessage({ id: 'typeCustomer' }),
  };
  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) {
      return (
        <span className="text-gray-300">
          <FormattedMessage id="noData" />
        </span>
      );
    }
    return <span className="text-[#3bab7b] font-medium">{value}</span>;
  };

  /* ================= Fetch User ================= */

  const fetchUser = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(`/back/admin/users/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setUser(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: 'failedToFetchUsers' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [intl.locale, id]);

  // Image
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || 'Preview');
  };

  /* ================= Add User ================= */
  const handleAdd = async (values: any) => {
    try {
      setAddLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('password', values.password);
      formData.append('password_confirmation', values.password_confirmation);
      formData.append('type', values.type);
      formData.append('status', values.status);
      if (values.profile_image?.[0]?.originFileObj) {
        formData.append('profile_image', values.profile_image[0].originFileObj);
      }
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post('/back/admin/users', formData, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'addSuccess' }));
      setAddOpen(false);
      fetchUser();
      navigate('/admin/users');
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'addFailed' }));
    } finally {
      setAddLoading(false);
    }
  };

  /* ================= Edit User ================= */
  const handleEdit = async (values: any) => {
    if (!selectedId) return;
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      if (values.password) {
        formData.append('password', values.password);
        formData.append('password_confirmation', values.password_confirmation);
      }
      formData.append('type', values.type);
      formData.append('status', values.status);
      if (values.profile_image?.[0]?.originFileObj) {
        formData.append('profile_image', values.profile_image[0].originFileObj);
      }
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/users/${selectedId}`, formData, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'editSuccess' }));
      setEditOpen(false);
      fetchUser();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'editFailed' }));
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (editItem) {
      const fileList = editItem.image
        ? [
            {
              uid: '-1',
              name: 'current_image.jpg',
              status: 'done',
              url: editItem.image,
            },
          ]
        : [];

      editForm.setFieldsValue({
        ...editItem,
        profile_image: fileList,
      });
    }
  }, [editItem]);

  /* ================= Delete User ================= */
  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      setDelLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.delete(`/back/admin/users/${selectedId}`, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'deleteSuccess' }));
      setDeleteOpen(false);
      // fetchUser();
      navigate('/admin/users');
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'deleteFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Upload Helper ================= */
  const normFile = (e: any) => {
    if (!e) return [];
    return Array.isArray(e) ? e : e.fileList;
  };

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= UI ================= */

  return (
    <section className="pt-3">
      {/* ===== Header Actions ===== */}
      <div className="flex justify-end items-center gap-3">
        {/* Edit */}
        <Tooltip title={intl.formatMessage({ id: 'editUser' })} color="#27aa71">
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(user.id);

              const fileList = user.image
                ? [
                    {
                      uid: '-1',
                      name: 'image.png',
                      status: 'done',
                      url: user.image,
                    },
                  ]
                : [];

              setEditItem(user);
              editForm.setFieldsValue({
                ...user,
                profile_image: fileList,
              });
              setEditOpen(true);
            }}
          />
        </Tooltip>

        {/* Delete */}
        <Tooltip title={intl.formatMessage({ id: 'deleteUser' })} color="#d30606ff">
          <FiTrash
            className="text-[#d30606ff] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(user.id);
              setDeleteOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip title={intl.formatMessage({ id: 'addUser' })} color="#2ab479">
          <Button
            type="primary"
            shape="circle"
            icon={<FaPlus />}
            onClick={() => {
              addForm.resetFields();
              setAddOpen(true);
            }}
          />
        </Tooltip>
      </div>
      {/* ===== Details ===== */}

      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="userId" />
            </b>
          }
        >
          {displayValue(user.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="name" />
            </b>
          }
        >
          {displayValue(user.name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="email" />
            </b>
          }
        >
          {displayValue(user.email)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="phone" />
            </b>
          }
        >
          {displayValue(user.phone)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]"> {intl.formatMessage({ id: 'image' })}</b>}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt="User"
              style={{
                width: 130,
                height: 130,
                // objectFit: "cover",
                borderRadius: 8,
              }}
              preview={{
                mask: (
                  <p className="flex items-center gap-1 text-white text-sm">
                    <AiOutlineEye className="text-lg" />
                    <span className="text-sm">
                      <FormattedMessage id="preview" />
                    </span>
                  </p>
                ),
              }}
            />
          ) : (
            displayValue(null)
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'type' })}</b>}
        >
          {displayValue(userTypeMap[user.type]) || displayValue(null)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'status' })}</b>}
        >
          {displayValue(userStatusMap[user.status]) || displayValue(null)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'isActive' })}</b>}
        >
          <Tag className="px-2 py-1" color="#3bab7b">
            {user.is_active ? intl.formatMessage({ id: 'yes' }) : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'phoneVerified' })}</b>}
        >
          <Tag color="#3bab7b" className="px-2 py-1">
            {user.is_phone_verified
              ? intl.formatMessage({ id: 'yes' })
              : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">{intl.formatMessage({ id: 'activeNotification' })}</b>
          }
        >
          <Tag color="#3bab7b" className="px-2 py-1">
            {user.active_notification
              ? intl.formatMessage({ id: 'yes' })
              : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'businessName' })}</b>}
        >
          {displayValue(user.business_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'employeePosition' })}</b>}
        >
          {displayValue(user.employee_position)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}
        >
          {displayValue(user.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}
        >
          {displayValue(user.updated_at)}
        </Descriptions.Item>

        {/* ===== Social Media ===== */}
        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}
        >
          {displayValue(user.created_at)}
        </Descriptions.Item>
        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}
        >
          {displayValue(user.updated_at)}
        </Descriptions.Item>

        {/* ===== Social Media ===== */}
        {user.socialMedia?.length > 0 && (
          <Descriptions.Item
            label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'socialMedia' })}</b>}
          >
            <div className="flex flex-wrap gap-2">
              {user.socialMedia.map((item) => (
                <a key={item.social_media_id} href={item.url} target="_blank" rel="noreferrer">
                  <Tag color="blue" className="flex items-center gap-1 cursor-pointer px-2 py-1">
                    {item.social_media_image && (
                      <Avatar size="small" src={item.social_media_image} />
                    )}
                    {item.social_media_name}
                  </Tag>
                </a>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* ================= Add Modal ================= */}
      <Modal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        confirmLoading={addLoading}
        onOk={() => addForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="addUser" />
        </h2>
        <Form layout="vertical" form={addForm} onFinish={handleAdd}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'name' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'name' })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'email' })} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={intl.formatMessage({ id: 'phone' })}
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                  if (saudiPhoneRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(intl.formatMessage({ id: 'invalidPhone' })));
                },
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'phone' })} />
          </Form.Item>
          <Form.Item
            name="password"
            label={intl.formatMessage({ id: 'password' })}
            rules={[{ required: true }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'password' })} />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={intl.formatMessage({ id: 'confirmPassword' })}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(intl.formatMessage({ id: 'reset.password.not.match' }));
                },
              }),
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'confirmPassword' })} />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'type' })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'type' })}
              options={Object.entries(userTypeMap)
                .filter(([value]) => [4, 5].includes(Number(value)))
                .map(([value, label]) => ({
                  value: Number(value),
                  label,
                }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'status' })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'status' })}
              options={Object.entries(userStatusMap).map(([value, label]) => ({
                value: Number(value),
                label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="profile_image"
            label={intl.formatMessage({ id: 'image' })}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onPreview={handlePreview}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}
      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="editUser" />
        </h2>
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'name' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'name' })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'email' })} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={intl.formatMessage({ id: 'phone' })}
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                  if (saudiPhoneRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(intl.formatMessage({ id: 'invalidPhone' })));
                },
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'phone' })} />
          </Form.Item>
          <Form.Item
            name="password"
            label={intl.formatMessage({ id: 'password' })}
            // rules={[{ required: true }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'password' })} />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={intl.formatMessage({ id: 'confirmPassword' })}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(intl.formatMessage({ id: 'reset.password.not.match' }));
                },
              }),
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'confirmPassword' })} />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'type' })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'type' })}
              options={Object.entries(userTypeMap)
                .filter(([value]) => [4, 5].includes(Number(value)))
                .map(([value, label]) => ({
                  value: Number(value),
                  label,
                }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'status' })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'status' })}
              options={Object.entries(userStatusMap).map(([value, label]) => ({
                value: Number(value),
                label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="profile_image"
            label={intl.formatMessage({ id: 'image' })}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // rules={[{ required: true }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onPreview={handlePreview}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}
      <Modal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        confirmLoading={delLoading}
        onOk={handleDelete}
        okButtonProps={{ danger: true }}
      >
        <h2 className="text-[#d30606] font-semibold text-lg mb-2">
          <FormattedMessage id="deleteUser" />
        </h2>
        <p>
          <FormattedMessage id="deleteConfirm" />
        </p>
      </Modal>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        closable={false}
        centered
        className="!w-auto !max-w-[90vw]"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex items-center justify-center max-h-[80vh]">
          <img
            alt={previewTitle}
            src={previewImage}
            className="max-w-full max-h-[80vh] !min-w-[250px] w-full object-contain rounded"
          />
        </div>
      </Modal>
    </section>
  );
}

export default UserDetails;

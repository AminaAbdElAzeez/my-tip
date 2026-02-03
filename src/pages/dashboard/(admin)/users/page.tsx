import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Select, Upload, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RollerLoading from 'components/loading/roller';

/* ================= Types ================= */
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
  active_notification: boolean | null;
  created_at: string;
  updated_at: string;
}

/* ================= Component ================= */
function Users() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<User | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

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

  /* ================= Fetch Users ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar-sa' : 'en-us';
      const res = await axios.get(
        `/back/admin/users?page=${pagination.current}&take=${pagination.pageSize}`,
        { headers: { 'Accept-Language': lang } },
      );
      setData(res.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
      }));
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

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
      if (values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const res = await axios.post('/back/admin/users', formData);
      message.success(res.data?.message || intl.formatMessage({ id: 'addSuccess' }));
      setAddOpen(false);
      fetchUsers();
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
      if (values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const res = await axios.post(`/back/admin/users/${selectedId}`, formData);
      message.success(res.data?.message || intl.formatMessage({ id: 'editSuccess' }));
      setEditOpen(false);
      fetchUsers();
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
        image: fileList, // مهم جدًا: Upload محتاج array
      });
    }
  }, [editItem]);

  /* ================= Delete User ================= */
  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      setDelLoading(true);
      const res = await axios.delete(`/back/admin/users/${selectedId}`);
      message.success(res.data?.message || intl.formatMessage({ id: 'deleteSuccess' }));
      setDeleteOpen(false);
      fetchUsers();
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

  /* ================= Table Columns ================= */
  const columns: ColumnsType<User> = [
    {
      title: intl.formatMessage({ id: 'userId' }),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'email' }),
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'phone' }),
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'type' }),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: '7%',
      render: (type) => <span>{userTypeMap[type] || intl.formatMessage({ id: 'typeOther' })}</span>,
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '8%',
      render: (status) => {
        const color = status === 2 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={color}>
            {userStatusMap[status] || intl.formatMessage({ id: 'statusUnknown' })}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'isActive' }),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      width: '6%',
      render: (val) =>
        val ? (
          <span className="text-green-600">{intl.formatMessage({ id: 'yes' })}</span>
        ) : (
          <span className="text-red-600">{intl.formatMessage({ id: 'no' })}</span>
        ),
    },
    {
      title: intl.formatMessage({ id: 'phoneVerified' }),
      dataIndex: 'is_phone_verified',
      key: 'is_phone_verified',
      align: 'center',
      width: '10%',
      render: (val) =>
        val ? (
          <span className="text-green-600">{intl.formatMessage({ id: 'yes' })}</span>
        ) : (
          <span className="text-red-600">{intl.formatMessage({ id: 'no' })}</span>
        ),
    },
    {
      title: intl.formatMessage({ id: 'activeNotification' }),
      dataIndex: 'active_notification',
      key: 'active_notification',
      align: 'center',
      width: '9%',
      render: (val) =>
        val ? (
          <span className="text-green-600">{intl.formatMessage({ id: 'yes' })}</span>
        ) : (
          <span className="text-red-600">{intl.formatMessage({ id: 'no' })}</span>
        ),
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: '8%',
      render: (img) =>
        img ? (
          <Image
            src={img}
            style={{
              width: 100,
              height: 70,
              objectFit: 'cover',
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
          <span className="text-gray-400">{intl.formatMessage({ id: 'noImage' })}</span>
        ),
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      fixed: 'right',
      width: '5%',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip title={intl.formatMessage({ id: 'viewUser' })}>
            <AiOutlineEye
              className="text-[#214380] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/users/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'edit' })}>
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);

                const fileList = record.image
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: record.image,
                      },
                    ]
                  : [];

                setEditItem(record);
                editForm.setFieldsValue({
                  ...record,
                  image: fileList,
                });
                setEditOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'delete' })}>
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                setDeleteOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith('/users') ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addUser' })}>
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
              )}
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 2000, y: 375 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, size) =>
                  setPagination({
                    ...pagination,
                    current: page,
                    pageSize: size!,
                  }),
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

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
              options={Object.entries(userTypeMap).map(([value, label]) => ({
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
            name="image"
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
              options={Object.entries(userTypeMap).map(([value, label]) => ({
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
            name="image"
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
    </>
  );
}

export default Users;

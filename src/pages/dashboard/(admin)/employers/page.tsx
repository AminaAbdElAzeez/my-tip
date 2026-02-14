import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, message, Tooltip, Image, Input, Select, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RollerLoading from 'components/loading/roller';
import { Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';

/* ================= Types ================= */
interface Employer {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  business_name: string;
  business_type_name: string;
  status: number;
  image: string;
  created_at: string;
  updated_at: string;

  business_name_en?: string;
  business_name_ar?: string;
  business_type_id?: number;
  commercial_register?: string;
  tax_number?: string;
}

const EMPLOYER_STATUS_MAP: Record<number, { key: string; color: string }> = {
  1: { key: 'employer.status.pending', color: 'orange' },
  2: { key: 'employer.status.active', color: 'green' },
  3: { key: 'employer.status.inactive', color: 'red' },
  6: { key: 'employer.status.reject', color: 'red' },   
};

function Employers() {
  const [allData, setAllData] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editItem, setEditItem] = useState<Employer | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [businessTypes, setBusinessTypes] = useState<{ id: number; name: string }[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const EMPLOYER_STATUS_KEYS: Record<number, string> = {
    1: 'employer.status.pending',
    2: 'employer.status.active',
    3: 'employer.status.inactive',
    5: 'employer.status.rejected',
  };

  /* ================= Fetch Once ================= */
  const fetchEmployers = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/employers`, {
        headers: { 'Accept-Language': lang },
      });

      setAllData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'failedToFetchEmployers' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const res = await axios.get('/back/admin/business-types');

      setBusinessTypes(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchBusinessTypesFailed' }));
    }
  };

  useEffect(() => {
    fetchEmployers();
    fetchBusinessTypes();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchEmployers();
  }, [intl.locale]);

  /* ================= Client Pagination ================= */
  const handleTableChange = (paginationData: any) => {
    setPagination({
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    });
  };

  /* ================= Client Pagination ================= */

  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = pagination.current * pagination.pageSize;

  const paginatedData = allData.slice(startIndex, endIndex);

  /* ================= Delete ================= */
  const handleDelete = async (id: number) => {
    try {
      setDelLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';
      // const token = localStorage.getItem("token");

      const res = await axios.delete(`/back/admin/employers/${id}`, {
        headers: {
          'Accept-Language': lang,
          // Authorization: `Bearer ${token}`,
        },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));
      navigate('/admin/employers');

      // fetchEmployers();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

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

  /* ================= Columns ================= */

  const columns: ColumnsType<Employer> = [
    {
      title: intl.formatMessage({ id: 'employerId' }),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '8%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'userName' }),
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
      width: '10%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'email' }),
      dataIndex: 'user_email',
      key: 'user_email',
      align: 'center',
      width: '13%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'phone' }),
      dataIndex: 'user_phone',
      key: 'user_phone',
      align: 'center',
      width: '8%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'businessName' }),
      dataIndex: 'business_name',
      key: 'business_name',
      align: 'center',
      width: '10%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'businessType' }),
      dataIndex: 'business_type_name',
      key: 'business_type_name',
      align: 'center',
      width: '7%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '8%',
      render: (status) => {
        const item = EMPLOYER_STATUS_MAP[status];

        return item ? (
          <span className={`text-${item.color}-600`}>
            <FormattedMessage id={item.key} />
          </span>
        ) : (
          <FormattedMessage id="noData" />
        );
      },
    },

    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: '10%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      width: '10%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      align: 'center',
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="Employer"
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
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    {
      title: intl.formatMessage({ id: 'actions' }),
      fixed: 'right',
      width: '6%',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'viewEmployer' })} color="#a86b9e">
            <AiOutlineEye
              className="text-[#a86b9e] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/employers/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'editEmployer' })} color="#27aa71">
            <FiEdit
              className="text-[#27aa71] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name: record.user_name,
                  email: record.user_email,
                  phone: record.user_phone,
                  password: '',
                  business_name_en: record.business_name,
                  business_name_ar: record.business_name,
                  commercial_register: record.commercial_register,
                  tax_number: record.tax_number,
                  business_type_id: record.business_type_id,
                  status: record.status,
                  image: record.image
                    ? [
                        {
                          uid: '-1',
                          name: 'image.png',
                          status: 'done',
                          url: record.image,
                        },
                      ]
                    : [],
                });

                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteEmployer' })} color="#d30606">
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith('/employers') ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            // <Table
            //   title={() => (
            //     <Tooltip title={intl.formatMessage({ id: 'addEmployer' })} color="#2ab479">
            //       <Button
            //         type="primary"
            //         shape="circle"
            //         icon={<FaPlus />}
            //         onClick={() => {
            //           addForm.resetFields();
            //           setIsAddModalOpen(true);
            //         }}
            //       />
            //     </Tooltip>
            //   )}
            //   rowKey="id"
            //   columns={columns}
            //   dataSource={paginatedData}
            //   scroll={{ x: 2000, y: 365 }}
            //   pagination={{
            //     current: pagination.current,
            //     pageSize: pagination.pageSize,
            //     total: allData.length,
            //     showSizeChanger: true,
            //     pageSizeOptions: ['10', '15', '20', '50', '100'],

            //     onChange: (page, size) => {
            //       setPagination({
            //         current: page,
            //         pageSize: size!,
            //       });
            //     },
            //   }}
            // />
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addEmployer' })} color="#2ab479">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    onClick={() => {
                      addForm.resetFields();
                      setIsAddModalOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              scroll={{ x: 2000, y: 375 }}
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: allData.length,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onChange: (page, size) => {
                  setPagination({ current: page, pageSize: size! });
                },
              }}
              onChange={handleTableChange}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}
      {/* create */}
      <Modal
        destroyOnClose
        open={isAddModalOpen}
        confirmLoading={addLoading}
        onCancel={() => {
          addForm.resetFields();
          setIsAddModalOpen(false);
        }}
        onOk={async () => {
          try {
            setAddLoading(true);

            const values = await addForm.validateFields();

            const formData = new FormData();

            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('password', values.password);

            formData.append('business_name_en', values.business_name_en);
            formData.append('business_name_ar', values.business_name_ar);

            formData.append('commercial_register', values.commercial_register);
            formData.append('tax_number', values.tax_number);

            formData.append('business_type_id', values.business_type_id);

            if (values.image?.[0]?.originFileObj) {
              formData.append('image', values.image[0].originFileObj);
            }
            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post('/back/admin/employers', formData, {
              headers: {
                'Accept-Language': lang,
                // Authorization: `Bearer ${token}`,
              },
            });

            message.success(res.data?.message || intl.formatMessage({ id: 'addSuccess' }));
            addForm.resetFields();
            setIsAddModalOpen(false);
            fetchEmployers();
            navigate('/admin/employers/pending');
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'addFailed' }));
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          <FormattedMessage id="addEmployer" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'userName' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'userName' })} />
          </Form.Item>

          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ type: 'email', required: true }]}
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
            name="business_name_en"
            label={intl.formatMessage({ id: 'businessNameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'businessNameEn' })} />
          </Form.Item>

          <Form.Item
            name="business_name_ar"
            label={intl.formatMessage({ id: 'businessNameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'businessNameAr' })} />
          </Form.Item>

          <Form.Item
            name="commercial_register"
            label={intl.formatMessage({ id: 'commercialRegister' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'commercialRegister' })} />
          </Form.Item>

          <Form.Item
            name="tax_number"
            label={intl.formatMessage({ id: 'taxNumber' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'taxNumber' })} />
          </Form.Item>

          <Form.Item
            name="business_type_id"
            label={intl.formatMessage({ id: 'businessType' })}
            rules={[{ required: true }]}
          >
            <Select
              className="w-full border p-2! rounded"
              placeholder={intl.formatMessage({ id: 'businessType' })}
            >
              {businessTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label={intl.formatMessage({ id: 'image' })}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
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

      {/* Update Modal */}
      <Modal
        open={isEditModalOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={async () => {
          try {
            setEditLoading(true);

            const values = await editForm.validateFields();

            const formData = new FormData();
            formData.append('_method', 'put');

            // Append all fields
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('password', values.password || '');
            formData.append('business_name_en', values.business_name_en);
            formData.append('business_name_ar', values.business_name_ar);
            formData.append('commercial_register', values.commercial_register);
            formData.append('tax_number', values.tax_number);
            formData.append('business_type_id', values.business_type_id);
            formData.append('status', values.status);

            // Handle image upload
            if (values.image?.[0]?.originFileObj) {
              formData.append('image', values.image[0].originFileObj);
            }
            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post(`/back/admin/employers/${editItem?.id}`, formData, {
              headers: {
                'Accept-Language': lang,
                // Authorization: `Bearer ${token}`,
              },
            });

            message.success(res.data?.message || intl.formatMessage({ id: 'updateSuccess' }));
            setIsEditModalOpen(false);
            fetchEmployers();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'editFailed' }));
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h3 className="font-semibold mb-3">
          <FormattedMessage id="editEmployer" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'userName' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'userName' })} />
          </Form.Item>

          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            rules={[{ type: 'email', required: true }]}
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

          <Form.Item name="password" label={intl.formatMessage({ id: 'password' })}>
            <Input.Password placeholder={intl.formatMessage({ id: 'password' })} />
          </Form.Item>

          <Form.Item
            name="business_name_en"
            label={intl.formatMessage({ id: 'businessNameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'businessNameEn' })} />
          </Form.Item>

          <Form.Item
            name="business_name_ar"
            label={intl.formatMessage({ id: 'businessNameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'businessNameAr' })} />
          </Form.Item>

          <Form.Item
            name="commercial_register"
            label={intl.formatMessage({ id: 'commercialRegister' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'commercialRegister' })} />
          </Form.Item>

          <Form.Item
            name="tax_number"
            label={intl.formatMessage({ id: 'taxNumber' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'taxNumber' })} />
          </Form.Item>

          <Form.Item
            name="business_type_id"
            label={intl.formatMessage({ id: 'businessType' })}
            rules={[{ required: true }]}
          >
            <Select placeholder={intl.formatMessage({ id: 'businessType' })}>
              {businessTypes.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'status' })}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={1}>
                <FormattedMessage id="employer.status.pending" />
              </Select.Option>
              <Select.Option value={2}>
                <FormattedMessage id="employer.status.active" />
              </Select.Option>
              <Select.Option value={3}>
                <FormattedMessage id="employer.status.inactive" />
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label={intl.formatMessage({ id: 'image' })}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onPreview={handlePreview}
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteEmployer" />
        </h3>
        <FormattedMessage id="deleteConfirmEmployer" />
      </Modal>

      {/* preview image */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        closable={false}
        centered
        className="!w-auto !max-w-[90vw]"
        bodyStyle={{
          padding: 0,
        }}
      >
        <div className="flex items-center justify-center max-h-[80vh]">
          <img
            alt="preview"
            src={previewImage}
            className="max-w-full max-h-[80vh] !min-w-[250px] w-full  object-contain rounded"
          />
        </div>
      </Modal>
    </>
  );
}

export default Employers;

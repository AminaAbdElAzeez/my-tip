import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  message,
  Descriptions,
  Tooltip,
  Form,
  Modal,
  Input,
  Button,
  Select,
  Image,
  Tag,
  Upload,
} from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import { PlusOutlined } from '@ant-design/icons';

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
};

function EmployersDetails() {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [addLoading, setAddLoading] = useState(false);

  const [editItem, setEditItem] = useState<Employer | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [businessTypes, setBusinessTypes] = useState<{ id: number; name: string }[]>([]);

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) {
      return (
        <p className="text-gray-300">
          <FormattedMessage id="noData" />
        </p>
      );
    }
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  const EMPLOYER_STATUS_MAP: Record<number, { key: string; color: string }> = {
    1: { key: 'employer.status.pending', color: 'orange' },
    2: { key: 'employer.status.active', color: 'green' },
    3: { key: 'employer.status.inactive', color: 'red' },
    5: { key: 'employer.status.rejected', color: 'volcano' },
  };

  const renderStatus = (status: number) => {
    const statusData = EMPLOYER_STATUS_MAP[status];

    if (!statusData) {
      return (
        <Tag className="py-1 px-2">
          <FormattedMessage id="noData" />
        </Tag>
      );
    }

    return (
      <Tag color={statusData.color} className="py-1 px-2">
        <FormattedMessage id={statusData.key} />
      </Tag>
    );
  };

  /* ================= Fetch Employer ================= */

  useEffect(() => {
    fetchEmployer();
  }, [id]);

  const fetchEmployer = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/employers/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setEmployer(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/business-types', {
        headers: { 'Accept-Language': lang },
      });

      setBusinessTypes(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchBusinessTypesFailed' }));
    }
  };

  // useEffect(() => {
  //   fetchEmployer();
  //   fetchBusinessTypes();
  // }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchEmployer();
    fetchBusinessTypes();
  }, [intl.locale]);

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
      // fetchEmployer();
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

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!employer)
    return (
      <div className="text-center text-gray-500 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= UI ================= */

  return (
    <section>
      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        {/* Edit */}
        <Tooltip title={intl.formatMessage({ id: 'editEmployer' })} color="#27aa71">
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              setEditItem(employer);
              editForm.setFieldsValue({
                name: employer.user_name,
                email: employer.user_email,
                phone: employer.user_phone,
                business_name_en: employer.business_name_en,
                business_name_ar: employer.business_name_ar,
                commercial_register: employer.commercial_register,
                tax_number: employer.tax_number,

                business_type_id: businessTypes.find(
                  (item) => item.name === employer.business_type_name,
                )?.id,

                status: employer.status,

                image: employer.image
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: employer.image,
                      },
                    ]
                  : [],
              });

              setIsEditModalOpen(true);
            }}
          />
        </Tooltip>

        {/* Delete */}
        <Tooltip title={intl.formatMessage({ id: 'deleteEmployer' })} color="#d30606ff">
          <FiTrash
            className="text-[#d30606ff] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(employer.id);
              setDeleteModalOpen(true);
            }}
          />
        </Tooltip>

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
      </div>

      {/* Details */}
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'employerId' })}</b>}
        >
          {displayValue(employer.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'userName' })}</b>}
        >
          {displayValue(employer.user_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'email' })}</b>}
        >
          {displayValue(employer.user_email)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'phone' })}</b>}
        >
          {displayValue(employer.user_phone)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'businessName' })}</b>}
        >
          {displayValue(employer.business_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'businessType' })}</b>}
        >
          {displayValue(employer.business_type_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'status' })}</b>}
        >
          {renderStatus(employer.status)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]"> {intl.formatMessage({ id: 'image' })}</b>}
        >
          {employer.image ? (
            <Image
              src={employer.image}
              alt="Employer"
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
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}
        >
          {displayValue(employer.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}
        >
          {displayValue(employer.updated_at)}
        </Descriptions.Item>
      </Descriptions>

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
            fetchEmployer();
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
            fetchEmployer();
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
    </section>
  );
}

export default EmployersDetails;

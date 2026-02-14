import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  message,
  Descriptions,
  Tooltip,
  Form,
  Input,
  Button,
  Select,
  Modal,
  Image,
  Upload,
  Tag,
} from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { PlusOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';

interface BusinessType {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  image: string;
  created_at: string;
  updated_at: string;
}

function BusinessTypeDetails() {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editItem, setEditItem] = useState<BusinessType | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const intl = useIntl();
  const { id } = useParams();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  /* ================= Helpers ================= */
  const displayValue = (value: any) =>
    value ? (
      <span className="text-[#3bab7b]">{value}</span>
    ) : (
      <p className="text-gray-300">
        <FormattedMessage id="noData" />
      </p>
    );

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
  };

  /* ================= Fetch Business Type ================= */
  const fetchBusinessType = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';
      const res = await axios.get(`/back/admin/business-types/${id}`, {
        headers: { 'Accept-Language': lang },
      });
      setBusinessType(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessType();
  }, [id, intl.locale]);

  /* ================= Delete ================= */
  const handleDelete = async (id: number) => {
    try {
      setDelLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.delete(`/back/admin/business-types/${id}`, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));
      setDeleteModalOpen(false);
      navigate('/admin/businessTypes');
      //   fetchBusinessType();
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Add Business Type ================= */
  const handleAdd = async () => {
    try {
      setAddLoading(true);
      const values = await addForm.validateFields();
      const formData = new FormData();
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);
      if (values.image?.file) formData.append('image', values.image.file.originFileObj);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post('/back/admin/business-types', formData, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'addSuccess' }));
      setIsAddModalOpen(false);
      navigate('/admin/businessTypes');

      fetchBusinessType();
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'addFailed' }));
    } finally {
      setAddLoading(false);
    }
  };

  /* ================= Edit Business Type ================= */
  const handleEdit = async () => {
    if (!editItem) return;
    try {
      setEditLoading(true);
      const values = await editForm.validateFields();
      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);
      if (values.image?.file) formData.append('image', values.image.file.originFileObj);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/business-types/${editItem.id}`, formData, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'editSuccess' }));
      setIsEditModalOpen(false);
      fetchBusinessType();
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'editFailed' }));
    } finally {
      setEditLoading(false);
    }
  };
  if (loading) return <RollerLoading />;
  if (!businessType)
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
        <Tooltip title={intl.formatMessage({ id: 'editBusinessType' })} color="#27aa71">
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              setEditItem(businessType);
              editForm.setFieldsValue({
                name_ar: businessType.name_ar,
                name_en: businessType.name_en,
              });
              setIsEditModalOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip title={intl.formatMessage({ id: 'deleteBusinessType' })} color="#d30606">
          <FiTrash
            className="text-[#d30606] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(businessType.id);
              setDeleteModalOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip title={intl.formatMessage({ id: 'addBusinessType' })} color="#3bab7b">
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
      <Descriptions bordered column={1} className='mt-4'>
        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'businessTypeId' })}</b>}>
          {displayValue(businessType.id)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'name' })}</b>}>
          {displayValue(businessType.name)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'nameAr' })}</b>}>
          {displayValue(businessType.name_ar)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'nameEn' })}</b>}>
          {displayValue(businessType.name_en)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'image' })}</b>}>
          {businessType.image ? (
            <Image
              src={businessType.image}
              alt="Business Type"
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

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}>
          {displayValue(businessType.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}>
          {displayValue(businessType.updated_at)}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= Add Modal ================= */}
      <Modal
        open={isAddModalOpen}
        confirmLoading={addLoading}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={handleAdd}
        okText={intl.formatMessage({ id: 'add' })}
      >
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          <FormattedMessage id="addBusinessType" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            label={<FormattedMessage id="nameAr" />}
            name="name_ar"
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameArReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="nameEn" />}
            name="name_en"
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameEnReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="image" />}
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[{ required: true, message: intl.formatMessage({ id: 'imageReq' }) }]}
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

      {/* ================= Edit Modal ================= */}
      <Modal
        open={isEditModalOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEdit}
        okText={intl.formatMessage({ id: 'edit' })}
      >
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          <FormattedMessage id="editBusinessType" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            label={<FormattedMessage id="nameAr" />}
            name="name_ar"
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameArReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="nameEn" />}
            name="name_en"
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameEnReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="image" />}
            name="image"
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

      {/* ================= Delete Modal ================= */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        onCancel={() => setDeleteModalOpen(false)}
        okButtonProps={{ danger: true }}
        onOk={() => selectedId && handleDelete(selectedId)}
        okText={intl.formatMessage({ id: 'delete' })}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          {intl.formatMessage({ id: 'deleteBusinessType' })}
        </h3>
        <FormattedMessage id="deleteConfirmBusinessType" />
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

export default BusinessTypeDetails;

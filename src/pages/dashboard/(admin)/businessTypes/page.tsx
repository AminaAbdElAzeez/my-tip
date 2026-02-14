import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Upload, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { UploadOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

/* ================= Types ================= */
interface BusinessType {
  id: number;
  name_ar: string;
  name_en: string;
  image: string;
  created_at: string;
}

/* ================= Component ================= */
function BusinessTypes() {
  const intl = useIntl();

  const [data, setData] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<BusinessType | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  /* ================= Fetch Business Types ================= */
  const fetchBusinessTypes = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/business-types`, {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);
  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchBusinessTypes();
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

  const paginatedData = data.slice(startIndex, endIndex);

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

      fetchBusinessTypes();
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Table Columns ================= */
  const columns: ColumnsType<BusinessType> = [
    {
      title: intl.formatMessage({ id: 'businessTypeId' }),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '15%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '15%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'nameAr' }),
      dataIndex: 'name_ar',
      key: 'name_ar',
      align: 'center',
      width: '15%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'nameEn' }),
      dataIndex: 'name_en',
      key: 'name_en',
      align: 'center',
      width: '15%',
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
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      fixed: 'right',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'viewBusinessType' })} color="#a86b9e">
            <AiOutlineEye
              className="text-[#a86b9e] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/businessTypes/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'editBusinessType' })} color="#3bab7b">
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name_ar: record.name_ar,
                  name_en: record.name_en,
                });
                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteBusinessType' })} color="#d30606">
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
      fetchBusinessTypes();
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
      fetchBusinessTypes();
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'editFailed' }));
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      {location.pathname.endsWith('/businessTypes') ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              rowKey="id"
              dataSource={paginatedData}
              columns={columns}
              scroll={{ x: 1300, y: 375 }}
              title={() => (
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
              )}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: data.length,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onChange: (page, size) => {
                  setPagination({ current: page, pageSize: size! });
                },
              }}
              onChange={handleTableChange}
            />
          )}

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
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default BusinessTypes;

import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Upload, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineUpload } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RollerLoading from 'components/loading/roller';
import { PlusOutlined } from '@ant-design/icons';

/* ================= Types ================= */

interface SocialMediaItem {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
}

/* ================= Component ================= */

function SocialMedia() {
  const [data, setData] = useState<SocialMediaItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<SocialMediaItem | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) {
      return (
        <span className="text-gray-400">
          <FormattedMessage id="noData" />
        </span>
      );
    }
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  /* ================= Fetch ================= */

  const fetchSocialMedia = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/social-media`, {
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
    fetchSocialMedia();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchSocialMedia();
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

  /* ================= Delete ================= */

  const handleDelete = async (id: number) => {
    try {
      setDelLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.delete(`/back/admin/social-media/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data?.message);
      fetchSocialMedia();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'deleteFailed' }));
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

  /* ================= Table Columns ================= */

  const columns: ColumnsType<SocialMediaItem> = [
    {
      title: intl.formatMessage({ id: 'socialMediaId' }),
      dataIndex: 'id',
      width: '16%',
      align: 'center',
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
      align: 'center',
      width: '14%',

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
      width: '14%',

      align: 'center',
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
      width: '11%',

      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'icon',
      key: 'icon',
      width: '12%',

      align: 'center',
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="icon"
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
      align: 'center',
      width: '11%',

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
      align: 'center',
      width: '11%',

      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      align: 'center',
      width: '9%',

      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'editSocialMedia' })} color="#27aa71">
            <FiEdit
              className="text-[#27aa71] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name_en: record.name_en,
                  name_ar: record.name_ar,
                  icon: record.icon
                    ? [
                        {
                          uid: '-1',
                          name: 'icon.png',
                          status: 'done',
                          url: record.icon,
                        },
                      ]
                    : [],
                });

                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteSocialMedia' })} color="#d30606">
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
      {location.pathname.endsWith('/socialMedia') ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addSocialMedia' })} color="#2ab479">
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
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              scroll={{ x: 1300, y: 375 }}
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
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Add ================= */}

      <Modal
        open={isAddModalOpen}
        confirmLoading={addLoading}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={async () => {
          try {
            setAddLoading(true);

            const values = await addForm.validateFields();

            const formData = new FormData();
            formData.append('name_en', values.name_en);
            formData.append('name_ar', values.name_ar);
            if (values.icon?.[0]?.originFileObj) {
              formData.append('icon', values.icon[0].originFileObj);
            }

            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post('/back/admin/social-media', formData, {
              headers: { 'Accept-Language': lang },
            });

            message.success(res.data?.message);
            setIsAddModalOpen(false);
            fetchSocialMedia();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'createFailed' }));
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h3 className="mb-3 text-[#3bab7b] font-semibold">
          <FormattedMessage id="addSocialMedia" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name_en"
            label={<FormattedMessage id="nameEn" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameEnReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
          </Form.Item>

          <Form.Item
            name="name_ar"
            label={<FormattedMessage id="nameAr" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'nameArReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            name="icon"
            label={intl.formatMessage({ id: 'icon' })}
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

      {/* ================= Edit ================= */}

      <Modal
        open={isEditModalOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={async () => {
          if (!editItem) return;

          try {
            setEditLoading(true);

            const values = await editForm.validateFields();

            const formData = new FormData();
            formData.append('_method', 'put');
            formData.append('name_en', values.name_en);
            formData.append('name_ar', values.name_ar);

            if (values.icon?.[0]?.originFileObj) {
              formData.append('icon', values.icon[0].originFileObj);
            }

            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post(`/back/admin/social-media/${editItem.id}`, formData, {
              headers: { 'Accept-Language': lang },
            });

            message.success(res.data?.message);
            setIsEditModalOpen(false);
            fetchSocialMedia();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'updateFailed' }));
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h3 className="mb-3 text-[#3bab7b] font-semibold">
          <FormattedMessage id="editSocialMedia" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name_en"
            label={<FormattedMessage id="nameEn" />}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
          </Form.Item>

          <Form.Item
            name="name_ar"
            label={<FormattedMessage id="nameAr" />}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            name="icon"
            label={intl.formatMessage({ id: 'icon' })}
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

      {/* ================= Delete ================= */}

      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        okButtonProps={{ danger: true }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          if (!selectedId) return;

          await handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteSocialMedia" />
        </h3>

        <p>
          <FormattedMessage id="deleteConfirmSocial" />
        </p>
      </Modal>
    </>
  );
}

export default SocialMedia;

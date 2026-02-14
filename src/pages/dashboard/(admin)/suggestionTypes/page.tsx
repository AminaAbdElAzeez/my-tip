import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, message, Tooltip, Input, Upload, Image, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEye } from 'react-icons/ai';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';

/* ================= Types ================= */
interface SuggestionType {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  image?: string;
  created_at: string;
  Updated_at: string;
}

function SuggestionTypes() {
  const [data, setData] = useState<SuggestionType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editItem, setEditItem] = useState<SuggestionType | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const intl = useIntl();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  /* ================= Fetch Suggestion Types ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';
      const res = await axios.get('/back/admin/suggestion-types', {
        headers: { 'Accept-Language': lang },
      });
      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailedSuggestionTypes' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      const res = await axios.delete(`/back/admin/suggestion-types/${id}`, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message);
      setDeleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || intl.formatMessage({ id: 'delSuggestionTypesFailed' }),
      );
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Add ================= */
  const handleAdd = async () => {
    try {
      setAddLoading(true);
      const values = await addForm.validateFields();
      const formData = new FormData();
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);

      if (values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';
      const res = await axios.post('/back/admin/suggestion-types', formData, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message);
      setIsAddModalOpen(false);

      addForm.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || intl.formatMessage({ id: 'addSuggestionTypesFailed' }),
      );
    } finally {
      setAddLoading(false);
    }
  };

  /* ================= Edit ================= */
  const handleEdit = async () => {
    if (!editItem) return;
    try {
      setEditLoading(true);
      const values = await editForm.validateFields();
      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);

      if (values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';
      const res = await axios.post(`/back/admin/suggestion-types/${editItem.id}`, formData, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data?.message);
      setIsEditModalOpen(false);
      editForm.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || intl.formatMessage({ id: 'editSuggestionTypesFailed' }),
      );
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Columns ================= */
  const columns: ColumnsType<SuggestionType> = [
    {
      title: intl.formatMessage({ id: 'suggestionTypeId' }),
      dataIndex: 'id',
      key: 'id',
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
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '18%',
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
      width: '18%',
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
      width: '18%',

      render: (text) =>
        text || (
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
      width: '13%',

      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'Updated_at',
      key: 'Updated_at',
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
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      align: 'center',
      width: '7%',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'editSuggestionType' })} color="#27aa71">
            <FiEdit
              className="text-[#27aa71] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name_ar: record.name_ar,
                  name_en: record.name_en,
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

          <Tooltip title={intl.formatMessage({ id: 'deleteSuggestionType' })} color="#d30606">
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

  if (loading) return <RollerLoading />;

  return (
    <div className="pt-3">
      <Table
        title={() => (
          <Tooltip title={intl.formatMessage({ id: 'addSuggestionType' })} color="#2ab479">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
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
        scroll={{ x: 1400, y: 375 }}
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

      {/* Add Modal */}
      <Modal
        open={isAddModalOpen}
        confirmLoading={addLoading}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={handleAdd}
      >
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          <FormattedMessage id="addSuggestionType" />
        </h3>
        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: 'nameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: 'nameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEdit}
      >
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          <FormattedMessage id="editSuggestionType" />
        </h3>
        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: 'nameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameAr' })} />
          </Form.Item>

          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: 'nameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'nameEn' })} />
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
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteSuggestionType" />
        </h3>
        <FormattedMessage id="deleteConfirmSuggestionType" />
      </Modal>
    </div>
  );
}

export default SuggestionTypes;

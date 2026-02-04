import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { Outlet } from 'react-router-dom';

/* ================= Types ================= */

interface ContactType {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  created_at: string;
}

/* ================= Component ================= */

const ContactTypes = () => {
  const intl = useIntl();

  const [data, setData] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ContactType | null>(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  /* ================= Fetch ================= */

  const fetchContactTypes = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(`/back/admin/contact-types?page=${pagination.current}`, {
        headers: {
          'Accept-Language': lang,
        },
      });

      setData(res.data?.data || []);

      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
      }));
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactTypes();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchContactTypes();
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

  /* ================= Add ================= */

  const handleAdd = async () => {
    try {
      setAddLoading(true);

      const values = await addForm.validateFields();

      const formData = new FormData();
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);

      const res = await axios.post('/back/admin/contact-types', formData);

      message.success(res.data?.message);

      setIsAddOpen(false);
      addForm.resetFields();
      fetchContactTypes();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'addFailed' }));
    } finally {
      setAddLoading(false);
    }
  };

  /* ================= Edit ================= */

  const handleEdit = async () => {
    if (!selectedItem) return;

    try {
      setEditLoading(true);

      const values = await editForm.validateFields();

      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('name_ar', values.name_ar);
      formData.append('name_en', values.name_en);

      const res = await axios.post(`/back/admin/contact-types/${selectedItem.id}`, formData);

      message.success(res.data?.message);

      setIsEditOpen(false);
      fetchContactTypes();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'editFailed' }));
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setDeleteLoading(true);

      const res = await axios.delete(`/back/admin/contact-types/${selectedItem.id}`);

      message.success(res.data?.message);

      setIsDeleteOpen(false);
      fetchContactTypes();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'deleteFailed' }));
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= Columns ================= */

  const columns: ColumnsType<ContactType> = [
    {
      title: intl.formatMessage({ id: 'ContactTypeId' }),
      dataIndex: 'id',
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
      align: 'center',
      width: '17%',

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
      align: 'center',
      width: '17%',

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
      align: 'center',
      width: '17%',

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
      align: 'center',
      width: '12%',

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
      width: '12%',

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
      width: '10%',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip title={intl.formatMessage({ id: 'editContactType' })} color='#27aa71'>
            <FiEdit
              className="text-[#27aa71] cursor-pointer text-lg"
              onClick={() => {
                setSelectedItem(record);
                editForm.setFieldsValue({
                  name_ar: record.name_ar,
                  name_en: record.name_en,
                });
                setIsEditOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteContactType' })} color='#d30606'>
            <FiTrash
              className="text-[#d30606] cursor-pointer text-lg"
              onClick={() => {
                setSelectedItem(record);
                setIsDeleteOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  /* ================= Render ================= */

  return (
    <>
      {location.pathname.endsWith('/contactTypes') ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addContactType' })} color="#2ab479">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    onClick={() => {
                      addForm.resetFields();
                      setIsAddOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              scroll={{ x: 1000, y: 375 }}
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

      {/* ================= Add Modal ================= */}

      <Modal
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onOk={handleAdd}
        confirmLoading={addLoading}
        title={
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          {intl.formatMessage({id:"addContactType"})}
        </h3>
        }
      >
        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name_ar"
            label={<FormattedMessage id="nameAr" />}
            rules={[{ required: true,message:intl.formatMessage({id:"nameArReq"}) }]}
          >
            <Input  placeholder={intl.formatMessage({id:"nameAr"}) }/>
          </Form.Item>

          <Form.Item
            name="name_en"
            label={<FormattedMessage id="nameEn" />}
            rules={[{ required: true,message:intl.formatMessage({id:"nameEnReq"}) }]}
          >
            <Input  placeholder={intl.formatMessage({id:"nameEn"}) }/>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}

      <Modal
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleEdit}
        confirmLoading={editLoading}
        title={
        <h3 className="text-[#3bab7b] text-xl mb-3 font-semibold">
          {intl.formatMessage({id:"editContactType"})}
        </h3>
        }
      >
        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name_ar"
            label={<FormattedMessage id="nameAr" />}
           rules={[{ required: true,message:intl.formatMessage({id:"nameArReq"}) }]}
          >
            <Input  placeholder={intl.formatMessage({id:"nameAr"}) }/>
          </Form.Item>

          <Form.Item
            name="name_en"
            label={<FormattedMessage id="nameEn" />}
           rules={[{ required: true,message:intl.formatMessage({id:"nameEnReq"}) }]}
          >
            <Input  placeholder={intl.formatMessage({id:"nameEn"}) }/>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}

      <Modal
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onOk={handleDelete}
        confirmLoading={deleteLoading}
        okButtonProps={{ danger: true }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteContactType" />
        </h3>
        <FormattedMessage id="deleteConfirmContactType" />
      </Modal>
    </>
  );
};

export default ContactTypes;

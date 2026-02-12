import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { Outlet } from 'react-router-dom';

interface Branch {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  employees_count: number;
  created_at: string;
  updated_at: string;
}

function Branches() {
  const intl = useIntl();
  const [data, setData] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Branch | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /* ================= Fetch Branches ================= */

  const fetchBranches = async (page = 1, perPage = 15) => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/employer/branches', {
        params: {
          page,
          per_page: perPage,
        },
        headers: {
          'Accept-Language': lang,
        },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchBranchesFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(pagination.current, pagination.pageSize);
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

  /* ================= Table Columns ================= */

  const columns: ColumnsType<Branch> = [
    {
      title: intl.formatMessage({ id: 'branchId' }),
      dataIndex: 'id',
      key: 'id',
      width: '9%',
      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'branchName' }),
      dataIndex: 'name',
      key: 'name',
      width: '17%',
      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'branchNameAr' }),
      dataIndex: 'name_ar',
      key: 'name_ar',
      width: '17%',
      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'branchNameEn' }),
      dataIndex: 'name_en',
      key: 'name_en',
      width: '17%',

      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'employeesCount' }),
      dataIndex: 'employees_count',
      key: 'employees_count',
      width: '13%',
      align: 'center',
      render: (text) =>
        text ?? (
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
      align: 'center',
      width: '7%',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'editBranch' })} color="#27aa71">
            <FiEdit
              className="text-[#27aa71] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name_en: record.name_en,
                  name_ar: record.name_ar,
                });
                setIsEditOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteBranch' })} color="#d30606">
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                setIsDeleteOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  /* ================= Return ================= */

  return (
    <>
      {location.pathname.endsWith('/branches') ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addBranch' })} color="#27aa71">
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
              rowKey="id"
              scroll={{ x: 1400, y: 375 }}
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
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
        confirmLoading={addLoading}
        onCancel={() => setIsAddOpen(false)}
        onOk={async () => {
          try {
            setAddLoading(true);

            const values = await addForm.validateFields();
            const formData = new FormData();

            formData.append('name_en', values.name_en);
            formData.append('name_ar', values.name_ar);

            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post('/back/employer/branches', formData, {
              headers: { 'Accept-Language': lang },
            });

            message.success(res.data.message);
            setIsAddOpen(false);
            fetchBranches();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'addBranchFailed' }));
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="addBranch" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: 'branchNameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'branchNameEn' })} />
          </Form.Item>

          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: 'branchNameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'branchNameAr' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}

      <Modal
        open={isEditOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditOpen(false)}
        onOk={async () => {
          try {
            setEditLoading(true);

            const values = await editForm.validateFields();
            const formData = new FormData();

            formData.append('_method', 'put');
            formData.append('name_en', values.name_en);
            formData.append('name_ar', values.name_ar);

            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post(`/back/employer/branches/${editItem?.id}`, formData, {
              headers: { 'Accept-Language': lang },
            });

            message.success(res.data.message);
            setIsEditOpen(false);
            fetchBranches();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'updateBranchFailed' }));
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="editBranch" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: 'branchNameEn' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'branchNameEn' })} />
          </Form.Item>

          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: 'branchNameAr' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'branchNameAr' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}

      <Modal
        open={isDeleteOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setIsDeleteOpen(false)}
        onOk={async () => {
          try {
            setDeleteLoading(true);

            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.delete(`/back/employer/branches/${selectedId}`, {
              headers: { 'Accept-Language': lang },
            });

            message.success(res.data.message);
            setIsDeleteOpen(false);
            fetchBranches();
          } catch (err: any) {
            message.error(err.message);
          } finally {
            setDeleteLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteBranch" />
        </h3>
        <FormattedMessage id="deleteConfirmBranch" />
      </Modal>
    </>
  );
}

export default Branches;

import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RollerLoading from 'components/loading/roller';

/* ================= Types ================= */
interface City {
  id: string;
  name_en: string;
  name_ar: string;
  governorate_id: string;
  governorate_name: string;
  created_at: string;
}

interface Governorate {
  id: string;
  name_en: string;
  name_ar: string;
}

/* ================= Component ================= */
function Cities() {
  const [data, setData] = useState<City[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<City | null>(null);

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

  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalCount: 0,
  });

  /* ================= Fetch Cities ================= */
  const fetchCities = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(
        `/admin/cities?pageSize=${pagination.pageSize}&pageNumber=${pagination.currentPage + 1}`,
        { headers: { 'Accept-Language': lang } }
      );

      setData(res.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: res.data?.count || 0,
      }));
    } catch {
      message.error(intl.formatMessage({ id: 'failedToFetchCities' }));
    } finally {
      setLoading(false);
    }
  };

  /* ================= Fetch Governorates ================= */
  const fetchGovernorates = async () => {
    try {
      const res = await axios.get('/admin/governorates');
      setGovernorates(res.data?.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchCities();
    fetchGovernorates();
  }, [pagination.currentPage, pagination.pageSize]);

  /* ================= Delete ================= */
  const handleDelete = async (id: string) => {
    try {
      setDelLoading(true);
      const res = await axios.delete(`/admin/cities/${id}`);
      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));
      fetchCities();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Table Columns ================= */
  const columns: ColumnsType<City> = [
    {
      title: intl.formatMessage({ id: 'cityId' }),
      dataIndex: 'id',
      key: 'id',
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
      title: intl.formatMessage({ id: 'governorate_id' }),
      dataIndex: 'governorate_id',
      key: 'governorate_id',
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
      title: intl.formatMessage({ id: 'governorate2' }),
      dataIndex: 'governorate_name',
      key: 'governorate_name',
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
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      fixed: 'right',
      width: '8%',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'viewCity' })} color="#214380">
            <AiOutlineEye
              className="text-[#214380] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/cities/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'editCity' })} color="#3bab7b">
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue({
                  name_en: record.name_en,
                  name_ar: record.name_ar,
                  governorate_id: record.governorate_id,
                });
                setIsEditModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'deleteCity' })} color="#d30606">
            <FiTrash
              className="text-[#d30606ff] text-xl cursor-pointer"
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
      {location.pathname.endsWith('/cities') ? (
        <div className="container mx-auto pt-6">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'addCity' })} color="#3bab7b">
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
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1500, y: 365 }}
              pagination={{
                total: pagination.totalCount,
                current: pagination.currentPage + 1,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                onChange: (page, size) =>
                  setPagination({ ...pagination, currentPage: page - 1, pageSize: size }),
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Add Modal ================= */}
      <Modal
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
            formData.append('name_en', values.name_en);
            formData.append('name_ar', values.name_ar);
            formData.append('governorate_id', values.governorate_id);

            const res = await axios.post('/admin/cities', formData);
            message.success(res.data?.message || intl.formatMessage({ id: 'successMsg' }));
            setIsAddModalOpen(false);
            fetchCities();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'errorMsgCity' }));
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="addCity" />
        </h2>

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
            name="governorate_id"
            label={<FormattedMessage id="governorate3" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'governorateReq' }) }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'governorate3' })}
              options={governorates.map((g) => ({
                value: g.id,
                label: intl.locale.startsWith('ar') ? g.name_ar : g.name_en,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}
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
            formData.append('governorate_id', values.governorate_id);

            const res = await axios.post(`/admin/cities/${editItem.id}`, formData);
            message.success(res.data?.message || intl.formatMessage({ id: 'updateSuccess' }));
            setIsEditModalOpen(false);
            fetchCities();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'editFailed' }));
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="editCity" />
        </h2>

        <Form layout="vertical" form={editForm}>
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
            name="governorate_id"
            label={<FormattedMessage id="governorate3" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'governorateReq' }) }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'governorate3' })}
              options={governorates.map((g) => ({
                value: g.id,
                label: intl.locale.startsWith('ar') ? g.name_ar : g.name_en,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        onCancel={() => setDeleteModalOpen(false)}
        okButtonProps={{ danger: true }}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-[19px] mb-2">
          <FormattedMessage id="deleteCity" />
        </h2>
        <h4 className="text-base capitalize text-[#333]">
          {intl.formatMessage({ id: 'deleteConfirmCity' })}
        </h4>
      </Modal>
    </>
  );
}

export default Cities;

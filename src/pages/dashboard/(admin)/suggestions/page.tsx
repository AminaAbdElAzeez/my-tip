import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, message, Tooltip, Select, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEye } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RollerLoading from 'components/loading/roller';

/* ================= Types ================= */

interface Suggestion {
  id: number;
  suggestion_type: string;
  description: string;
  status: number;
  attachment: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

/* ================= Component ================= */

function Suggestions() {
  const [data, setData] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const location = useLocation();
  const intl = useIntl();
  const navigate = useNavigate()

  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  /* ================= Status Map ================= */

  const suggestionStatusMap: Record<number, string> = {
  1: intl.formatMessage({ id: 'pending' }),
  2: intl.formatMessage({ id: 'reviewed' }),
  3: intl.formatMessage({ id: 'implemented' }),
  4: intl.formatMessage({ id: 'rejected' }),
};

  /* ================= Fetch Suggestions ================= */

  const fetchSuggestions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/back/admin/suggestions?page=${pagination.current}&take=${pagination.pageSize}`,
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
    fetchSuggestions();
  }, [pagination.current, pagination.pageSize]);

  /* ================= Update Status ================= */

  const handleEditStatus = async (values: any) => {
    if (!selectedId) return;

    try {
      setEditLoading(true);

      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('status', values.status);

      const res = await axios.post(`/back/admin/suggestions/${selectedId}/status`, formData);

      message.success(res.data?.message);

      setEditOpen(false);
      fetchSuggestions();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Table Columns ================= */

  const columns: ColumnsType<Suggestion> = [
    {
      title: intl.formatMessage({ id: 'suggestionsId' }),
      dataIndex: 'id',
      align: 'center',
      width: '8%',
    },
    {
      title: intl.formatMessage({ id: 'userId' }),
      dataIndex: ['user', 'id'],
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'userName' }),
      dataIndex: ['user', 'name'],
      align: 'center',
      width: '13%',
    },
    {
      title: intl.formatMessage({ id: 'userEmail' }),
      dataIndex: ['user', 'email'],
      align: 'center',
      width: '12%',
    },
    {
      title: intl.formatMessage({ id: 'suggestionType' }),
      dataIndex: 'suggestion_type',
      align: 'center',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'description' }),
      dataIndex: 'description',
      align: 'center',
      width: '14%',
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      align: 'center',
      width: '8%',
      render: (val) => {
        const color = val === 3 ? 'text-green-600' : val === 4 ? 'text-red-600' : 'text-orange-500';

        return <span className={color}>{suggestionStatusMap[val]}</span>;
      },
    },
    {
      title: intl.formatMessage({ id: 'attachment' }),
      dataIndex: 'attachment',
      align: 'center',
      width: '9%',
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
          <span className="text-gray-400">
            <FormattedMessage id="noAttachment" />
          </span>
        ),
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      align: 'center',
      width: '6%',
    },
    {
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'updated_at',
      align: 'center',
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      align: 'center',
      width: '6%',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: 'viewSuggestion' })}>
            <AiOutlineEye
              className="text-[#214380] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/suggestions/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'changeStatus' })}>
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                editForm.setFieldsValue({ status: record.status });
                setEditOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith('/suggestions') ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1800, y: 375 }}
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

      {/* ================= Update Status Modal ================= */}

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="updateSuggestionStatus" />
        </h2>

        <Form layout="vertical" form={editForm} onFinish={handleEditStatus}>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'status' })}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 1, label: intl.formatMessage({ id: 'pending' }) },
                { value: 2, label: intl.formatMessage({ id: 'reviewed' }) },
                { value: 3, label: intl.formatMessage({ id: 'implemented' }) },
                { value: 4, label: intl.formatMessage({ id: 'rejected' }) },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Suggestions;

import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, message, Tooltip, Form, Input, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FiCheck, FiX } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { AiOutlineEye } from 'react-icons/ai';
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';

/* ================= Types ================= */

interface UserRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  type: number;
  status: number;
  is_active: boolean;
  is_phone_verified: boolean;
  active_notification: boolean;
  created_at: string;
  updated_at: string;
}

/* ================= Component ================= */

const PendingUsersRequests = () => {
  const intl = useIntl();

  const [data, setData] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [buttonLoadingId, setButtonLoadingId] = useState<number | null>(null);

  const [rejectForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  /* ================= Maps for localization ================= */

  const userStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'statusPending' }),
    2: intl.formatMessage({ id: 'statusActive' }),
    3: intl.formatMessage({ id: 'statusInactive' }),
    5: intl.formatMessage({ id: 'statusIncompleted' }),
    6: intl.formatMessage({ id: 'statusReject' }),
  };

  const userTypeMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'typeAdmin' }),
    2: intl.formatMessage({ id: 'typeEmployer' }),
    3: intl.formatMessage({ id: 'typeEmployee' }),
    4: intl.formatMessage({ id: 'typeCreator' }),
    5: intl.formatMessage({ id: 'typeCustomer' }),
  };

  const booleanMap = {
    true: intl.formatMessage({ id: 'yes' }),
    false: intl.formatMessage({ id: 'no' }),
  };

  /* ================= Fetch Requests ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/users/join-request', {
        headers: {
          'Accept-Language': lang,
        },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchUsers();
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

  /* ================= Approve ================= */

  const handleApprove = async () => {
    if (!selectedId) return;

    try {
      setButtonLoadingId(selectedId);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/users/${selectedId}/approve`, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data?.message);

      setApproveModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setButtonLoadingId(null);
    }
  };

  /* ================= Reject ================= */

  const handleReject = async () => {
    if (!selectedId) return;

    try {
      const values = await rejectForm.validateFields();

      setButtonLoadingId(selectedId);

      const formData = new FormData();
      formData.append('reason', values.reason);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/users/${selectedId}/reject`, formData, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data?.message);

      setRejectModalOpen(false);
      rejectForm.resetFields();
      fetchUsers();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setButtonLoadingId(null);
    }
  };

  /* ================= Table Columns ================= */

  const columns: ColumnsType<UserRequest> = [
    {
      title: intl.formatMessage({ id: 'userId' }),
      dataIndex: 'id',
      align: 'center',
      width: '6%',
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
      dataIndex: 'email',
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
      title: intl.formatMessage({ id: 'phone' }),
      dataIndex: 'phone',
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
      title: intl.formatMessage({ id: 'type' }),
      dataIndex: 'type',
      align: 'center',
      width: '7%',

      render: (type) => userTypeMap[type],
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      width: '6%',

      align: 'center',
      render: (status) => userStatusMap[status],
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'image',
      key: 'image',
      width: '7%',

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
      title: intl.formatMessage({ id: 'isActive' }),
      dataIndex: 'is_active',
      align: 'center',
      width: '6%',

      render: (value) => (
        <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
          {booleanMap[value]}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'phoneVerified' }),
      dataIndex: 'is_phone_verified',
      align: 'center',
      width: '10%',

      render: (value) => (
        <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
          {booleanMap[value]}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'activeNotification' }),
      dataIndex: 'active_notification',
      align: 'center',
      width: '9%',

      render: (value) => (
        <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
          {booleanMap[value]}
        </span>
      ),
    },

    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
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
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '7%',

      align: 'center',
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
      fixed: 'right',
      width: '6%',

      render: (_, record) => {
        if (record.status !== 1) {
          return <span>{userStatusMap[record.status]}</span>;
        }

        return (
          <div className="flex justify-center gap-2">
            <Tooltip title={intl.formatMessage({ id: 'approveUser' })} color="#3bab7b">
              <IoMdCheckmarkCircleOutline
                className="text-[#3bab7b] !text-3xl cursor-pointer"
                onClick={() => {
                  setSelectedId(record.id);
                  setApproveModalOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title={intl.formatMessage({ id: 'rejectUser' })} color="#d30606ff">
              <IoIosCloseCircleOutline
                className="text-[#d30606ff] !text-3xl cursor-pointer"
                onClick={() => {
                  setSelectedId(record.id);
                  setRejectModalOpen(true);
                }}
              />
            </Tooltip>
          </div>
          // <div className="flex gap-2 justify-center">
          //   <Tooltip title={intl.formatMessage({ id: 'approve' })}>
          //     <Button
          //       type="primary"
          //       size="small"
          //       loading={buttonLoadingId === record.id}
          //       onClick={() => {
          //         setSelectedId(record.id);
          //         setApproveModalOpen(true);
          //       }}
          //     >
          //       <FiCheck />
          //     </Button>
          //   </Tooltip>

          //   <Tooltip title={intl.formatMessage({ id: 'reject' })}>
          //     <Button
          //       danger
          //       size="small"
          //       loading={buttonLoadingId === record.id}
          //       onClick={() => {
          //         setSelectedId(record.id);
          //         setRejectModalOpen(true);
          //       }}
          //     >
          //       <FiX />
          //     </Button>
          //   </Tooltip>
          // </div>
        );
      },
    },
  ];

  /* ================= Render ================= */

  return (
    <div className="pt-3">
      {loading ? (
        <RollerLoading />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
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
          scroll={{ x: 2100, y: 440 }}
        />
      )}

      {/* ============ Approve Modal ============ */}

      <Modal
        open={approveModalOpen}
        onCancel={() => setApproveModalOpen(false)}
        onOk={handleApprove}
        confirmLoading={buttonLoadingId === selectedId}
        title={<FormattedMessage id="approveConfirm" />}
      >
        <FormattedMessage id="approveConfirmMessage" />
      </Modal>

      {/* ============ Reject Modal ============ */}

      <Modal
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleReject}
        confirmLoading={buttonLoadingId === selectedId}
        title={<FormattedMessage id="rejectConfirm" />}
      >
        <Form layout="vertical" form={rejectForm}>
          <Form.Item
            name="reason"
            label={intl.formatMessage({ id: 'rejectReason' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'rejectReasonRequired' }),
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PendingUsersRequests;

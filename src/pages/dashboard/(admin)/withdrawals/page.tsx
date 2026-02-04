import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { BiDownload } from 'react-icons/bi';

/* ================= Types ================= */

interface WithdrawalUser {
  id: number;
  name: string;
  email: string;
}

interface WithdrawalReviewer {
  id: number;
  name: string;
}

interface WithdrawalStatus {
  value: number; // 0 pending | 1 approved | 2 rejected
  label: string;
}

interface Withdrawal {
  id: number;
  reference: string;
  amount: string;
  currency: string;
  is_priority?: number;
  user: WithdrawalUser;
  status: WithdrawalStatus;
  rejection_reason: string | null;
  review_notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewer: WithdrawalReviewer | null;
}

/* ================= Component ================= */

function Withdrawals() {
  const intl = useIntl();

  const [data, setData] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [selectedItem, setSelectedItem] = useState<Withdrawal | null>(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [form] = Form.useForm();

  /* ================= Fetch Withdrawals ================= */

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/withdrawals`, {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data || []);

      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
      }));
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchWithdrawals();
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

  /* ================= Status UI ================= */

  const renderStatus = (status: WithdrawalStatus) => {
    if (status.value === 0) return <Tag color="orange" className='px-2 py-1'>{status.label}</Tag>;

    if (status.value === 1) return <Tag color="green" className='px-2 py-1'>{status.label}</Tag>;

    return <Tag color="red" className='px-2 py-1'>{status.label}</Tag>;
  };

  /* ================= Priority Guard ================= */

  const handleActionClick = (record: Withdrawal, type: 'approve' | 'reject') => {
    if (record.status.value !== 0) return;

    if (record.is_priority === 1) {
      message.warning(intl.formatMessage({ id: 'priorityBlocked' }));
      return;
    }

    setSelectedItem(record);
    form.resetFields();

    if (type === 'approve') setApproveOpen(true);
    else setRejectOpen(true);
  };

  /* ================= Approve ================= */

  const handleApprove = async (values: any) => {
    if (!selectedItem) return;

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append('review_notes', values.review_notes);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/withdrawals/${selectedItem.id}/approve`, formData, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data.message);

      setApproveOpen(false);
      fetchWithdrawals();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= Reject ================= */

  const handleReject = async (values: any) => {
    if (!selectedItem) return;

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append('rejection_reason', values.rejection_reason);
      formData.append('review_notes', values.review_notes);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/withdrawals/${selectedItem.id}/reject`, formData, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data.message);

      setRejectOpen(false);
      fetchWithdrawals();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= Export ================= */

  const handleExport = async () => {
    try {
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/withdrawals/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'withdrawals.xlsx');
      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message);
    }
  };

  /* ================= Columns ================= */

  const columns: ColumnsType<Withdrawal> = [
    {
      title: intl.formatMessage({ id: 'withdrawalId' }),
      dataIndex: 'id',
      key: 'id',
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
      title: intl.formatMessage({ id: 'reference' }),
      dataIndex: 'reference',
      key: 'reference',
      width: '10%',
      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'user' }),
      key: 'user',
      align: 'center',
      width: '10%',
      render: (_, r) => (
        <div>
          <p className="font-semibold">{r.user?.name}</p>
          <p className="text-xs text-gray-400">{r.user?.email}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      key: 'amount',
      align: 'center',
      width: '7%',
      render: (_, r) => `${r.amount} ${r.currency}`,
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      key: 'status',
      align: 'center',
      render: (_, r) => renderStatus(r.status),
      width: '7%',
    },
    {
      title: intl.formatMessage({ id: 'requestedAt' }),
      dataIndex: 'requested_at',
      key: 'requested_at',
      width: '10%',
      align: 'center',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'reviewedAt' }),
      dataIndex: 'reviewed_at',
      key: 'reviewed_at',
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
      title: intl.formatMessage({ id: 'reviewer' }),
      key: 'reviewer',
      align: 'center',
      width: '10%',
      render: (_, r) => r.reviewer?.name || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: 'reviewNotes' }),
      dataIndex: 'review_notes',
      key: 'review_notes',
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
      title: intl.formatMessage({ id: 'rejectionReason' }),
      dataIndex: 'rejection_reason',
      key: 'rejection_reason',
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
      align: 'center',
      width: '9%',
      fixed: 'right',
      render: (_, record) => {
        // not Pending
        if (record.status.value !== 0) {
          return renderStatus(record.status);
        }

        // Priority blocked
        if (record.is_priority === 1) {
          return (
            <Tag color="red" className="text-center py-1 px-2">
              <FormattedMessage id="priorityBlocked" />
              <br />
              <FormattedMessage id="priorityBlocked2" />
            </Tag>
          );
        }

        // Pending Actions
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title={intl.formatMessage({ id: 'approveWithdrawals' })} color="#3bab7b">
              <IoMdCheckmarkCircleOutline
                className="text-[#3bab7b] !text-3xl cursor-pointer"
                onClick={() => handleActionClick(record, 'approve')}
              />
            </Tooltip>

            <Tooltip title={intl.formatMessage({ id: 'rejectWithdrawals' })} color="#d30606ff">
              <IoIosCloseCircleOutline
                className="text-[#d30606ff] !text-3xl cursor-pointer"
                onClick={() => handleActionClick(record, 'reject')}
              />
            </Tooltip>
          </div>
          // <div className="flex justify-center gap-2">
          //   <Button
          //     type="primary"
          //     size="small"
          //     onClick={() => handleActionClick(record, 'approve')}
          //   >
          //     <FormattedMessage id="approve" />
          //   </Button>

          //   <Button danger size="small" onClick={() => handleActionClick(record, 'reject')}>
          //     <FormattedMessage id="reject" />
          //   </Button>
          // </div>
        );
      },
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      {loading ? (
        <RollerLoading />
      ) : (
        <Table
          title={() => (
            <Tooltip title={intl.formatMessage({ id: 'exportExcel' })} color="#2ab479">
              <Button
                type="primary"
                shape="circle"
                icon={<BiDownload className='text-xl'/>}
                onClick={handleExport}
              ></Button>
            </Tooltip>
          )}
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          scroll={{ x: 2200, y: 385 }}
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

      {/* ================= Approve Modal ================= */}

      <Modal
        open={approveOpen}
        onCancel={() => setApproveOpen(false)}
        confirmLoading={actionLoading}
        onOk={() => form.submit()}
      >
        <h3 className="font-semibold text-lg mb-3">
          <FormattedMessage id="approveWithdrawal" />
        </h3>

        <Form layout="vertical" form={form} onFinish={handleApprove}>
          <Form.Item
            name="review_notes"
            label={<FormattedMessage id="reviewNotes" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'reviewNotesReq' }) }]}
          >
            <Input.TextArea rows={4} placeholder={intl.formatMessage({ id: 'reviewNotes' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Reject Modal ================= */}

      <Modal
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        confirmLoading={actionLoading}
        onOk={() => form.submit()}
      >
        <h3 className="font-semibold text-lg mb-3 text-red-600">
          <FormattedMessage id="rejectWithdrawal" />
        </h3>

        <Form layout="vertical" form={form} onFinish={handleReject}>
          <Form.Item
            name="rejection_reason"
            label={<FormattedMessage id="rejectionReason" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'rejectionReasonReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'rejectionReason' })} />
          </Form.Item>

          <Form.Item
            name="review_notes"
            label={<FormattedMessage id="reviewNotes" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'reviewNotesReq' }) }]}
          >
            <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'reviewNotes' })} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Withdrawals;

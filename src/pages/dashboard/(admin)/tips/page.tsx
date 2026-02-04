import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Tag, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { Outlet, useNavigate } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';

/* ================= Types ================= */

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: number;
  status?: number;
  profile_image: string;
  is_anonymous?: boolean;
}

interface Payment {
  id: number;
  transaction_id: string | null;
  payment_method: string | null;
  status: number;
}

interface Tip {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  message: string | null;
  is_anonymous: boolean;
  recipient_type: number;
  donor: User;
  recipient: User | null;
  payment: Payment;
  status: string;
  status_label: string;
  created_at: string;
  created_at_human: string;
}

/* ================= ENUM Maps ================= */

const recipientTypeMap: Record<number, string> = {
  1: 'EmployerGeneral',
  2: 'Employee',
  3: 'Creator',
};

const userTypeMap: Record<number, string> = {
  1: 'Admin',
  2: 'Employer',
  3: 'Employee',
  4: 'Creator',
  5: 'Customer',
};

const paymentStatusMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Pending', color: 'orange' },
  2: { label: 'Processing', color: 'blue' },
  3: { label: 'Completed', color: 'green' },
  4: { label: 'Failed', color: 'red' },
};

const userStatusMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Pending', color: 'orange' },
  2: { label: 'Active', color: 'green' },
  3: { label: 'Inactive', color: 'red' },
  5: { label: 'Incompleted', color: 'gold' },
  6: { label: 'Rejected', color: 'volcano' },
};

/* ================= Component ================= */

function Tips() {
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  /* ================= Fetch Tips ================= */

  const fetchTips = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/tips`, {
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
    fetchTips();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchTips();
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

  /* ================= Helpers ================= */

  const renderPaymentStatus = (status: number) => {
    const item = paymentStatusMap[status];
    if (!item) return '-';
    return <Tag color={item.color}>{item.label}</Tag>;
  };

  const renderUserStatus = (status?: number) => {
    if (!status) return '-';
    const item = userStatusMap[status];
    if (!item) return '-';
    return <Tag color={item.color}>{item.label}</Tag>;
  };

  /* ================= Columns ================= */

  const columns: ColumnsType<Tip> = [
    /* ===== Basic ===== */
    {
      title: intl.formatMessage({ id: 'tipsId' }),
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      align: 'center',
      render: (text) =>
        text ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'reference' }),
      dataIndex: 'reference',
      key: 'reference',
      width: '5%',

      align: 'center',
      render: (text) =>
        text ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      key: 'amount',
      width: '2.5%',

      align: 'center',
      render: (_, r) =>
        r.amount && r.currency ? (
          `${r.amount} ${r.currency}`
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'message' }),
      key: 'message',
      width: '6%',

      align: 'center',
      render: (_, r) =>
        r.message ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'anonymous' }),
      key: 'is_anonymous',
      width: '4%',
      align: 'center',
      render: (_, r) =>
        r.is_anonymous ? (
          <Tag color="blue">
            <FormattedMessage id="yes" />
          </Tag>
        ) : (
          <Tag>
            <FormattedMessage id="no" />
          </Tag>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientType' }),
      key: 'tip_recipient_type',
      width: '4%',
      align: 'center',
      render: (_, r) =>
        r.recipient_type && recipientTypeMap[r.recipient_type] ? (
          <FormattedMessage id={recipientTypeMap[r.recipient_type]} />
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    /* ===== Donor ===== */
    {
      title: intl.formatMessage({ id: 'donorId' }),
      width: '3%',
      align: 'center',
      render: (_, r) =>
        r.donor?.is_anonymous ? (
          <Tag color="purple">Anonymous</Tag>
        ) : (
          (r.donor?.id ?? (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          ))
        ),
    },
    {
      title: intl.formatMessage({ id: 'donorName' }),
      key: 'donor_name',
      align: 'center',
      width: '4%',

      render: (_, r) =>
        r.donor?.is_anonymous ? (
          <Tag color="purple">Anonymous</Tag>
        ) : (
          (r.donor?.name ?? (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          ))
        ),
    },
    {
      title: intl.formatMessage({ id: 'donorType' }),
      key: 'donor_type',
      align: 'center',
      width: '4%',

      render: (_, r) =>
        r.donor?.type && userTypeMap[r.donor.type] ? (
          <FormattedMessage id={userTypeMap[r.donor.type]} />
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'donorEmail' }),
      key: 'donor_email',
      align: 'center',
      width: '5%',

      render: (_, r) =>
        r.donor?.is_anonymous ? (
          <Tag color="purple">Anonymous</Tag>
        ) : (
          (r.donor?.email ?? (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          ))
        ),
    },
    {
      title: intl.formatMessage({ id: 'donorPhone' }),
      key: 'donor_phone',
      width: '3.5%',

      align: 'center',
      render: (_, r) =>
        r.donor?.is_anonymous ? (
          <Tag color="purple">Anonymous</Tag>
        ) : (
          (r.donor?.phone ?? (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          ))
        ),
    },

    /* ===== Recipient ===== */
    {
      title: intl.formatMessage({ id: 'recipientId' }),
      key: 'recipient_id',
      width: '3%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.id ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientName' }),
      key: 'recipient_name',
      width: '5%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.name ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientStatus' }),
      key: 'recipient_status',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.status ? (
          renderUserStatus(r.recipient.status)
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientType' }),
      key: 'recipient_type',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.type && userTypeMap[r.recipient.type] ? (
          <FormattedMessage id={userTypeMap[r.recipient.type]} />
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientEmail' }),
      key: 'recipient_email',
      width: '5%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.email ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'recipientPhone' }),
      key: 'recipient_phone',
      width: '3.5%',

      align: 'center',
      render: (_, r) =>
        r.recipient?.phone ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    /* ===== Payment ===== */
    {
      title: intl.formatMessage({ id: 'paymentId' }),
      key: 'payment_id',
      width: '3%',

      align: 'center',
      render: (_, r) =>
        r.payment?.id ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'transactionId' }),
      key: 'transaction_id',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.payment?.transaction_id ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'paymentMethod' }),
      key: 'payment_method',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.payment?.payment_method ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'paymentStatus' }),
      key: 'payment_status',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.payment?.status ? (
          renderPaymentStatus(r.payment.status)
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    /* ===== Tip Status ===== */
    {
      title: intl.formatMessage({ id: 'statusTips' }),
      key: 'status_label',
      width: '4%',

      align: 'center',
      render: (_, r) =>
        r.status_label ? (
          <Tag color="green">{r.status_label}</Tag>
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    /* ===== Dates ===== */
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      width: '5%',

      key: 'created_at',
      align: 'center',
      render: (text) =>
        text ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'createdAtHuman' }),
      dataIndex: 'created_at_human',
      key: 'created_at_human',
      width: '5%',

      align: 'center',
      render: (text) =>
        text ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },

    /* ===== Actions ===== */
    {
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      fixed: 'right',
      width: '2.5%',
      align: 'center',
      render: (_, record) => (
        <Tooltip title={intl.formatMessage({ id: 'viewUser' })}>
          <AiOutlineEye
            className="text-[#214380] text-2xl cursor-pointer"
            onClick={() => navigate(`/admin/tips/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      {location.pathname.endsWith('/tips') ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              scroll={{ x: 4200, y: 435 }}
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
    </>
  );
}

export default Tips;

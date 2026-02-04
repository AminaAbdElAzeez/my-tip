import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useParams } from 'react-router-dom';
import { message, Descriptions, Tag, Divider, Table } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import type { ColumnsType } from 'antd/es/table';

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

interface BreakdownItem {
  label: string;
  label_ar: string;
  amount: number;
  type: string;
}

interface Breakdown {
  gross_amount: number;
  admin_fee: number;
  employer_fee: number;
  net_amount: number;
  details: BreakdownItem[];
}

interface Transaction {
  user_name: string;
  user_type: number;
  amount: number;
  type: number;
}

interface TipDetails {
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
  breakdown: Breakdown;
  transactions: Transaction[];
}

/* ================= ENUM MAPS ================= */

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

const paymentStatusMap: Record<number, { id: string; color: string }> = {
  1: { id: 'pending', color: 'orange' },
  2: { id: 'processing', color: 'blue' },
  3: { id: 'completed', color: 'green' },
  4: { id: 'failed', color: 'red' },
};

/* ================= Component ================= */

function TipsDetails() {
  const { id } = useParams();
  const intl = useIntl();

  const [data, setData] = useState<TipDetails | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= Fetch ================= */

  const fetchTipDetails = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/admin/tips/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipDetails();
  }, [id]);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchTipDetails();
  }, [intl.locale, id]);

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">-</span>;
    }
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  const renderPaymentStatus = (status?: number) => {
    if (!status) return '-';

    const item = paymentStatusMap[status];
    if (!item) return '-';

    return (
      <Tag color={item.color}>
        <FormattedMessage id={item.id} />
      </Tag>
    );
  };

  /* ================= Transactions Columns ================= */

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: intl.formatMessage({ id: 'userName' }),
      dataIndex: 'user_name',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'userType' }),
      align: 'center',
      render: (_, r) => userTypeMap[r.user_type] || '-',
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      align: 'center',
      render: (_, r) => `${r.amount} ${data?.currency || ''}`,
    },
  ];

  /* ================= UI ================= */

  if (loading) return <RollerLoading />;

  if (!data)
    return (
      <div className="text-center mt-10 text-gray-500">
        <FormattedMessage id="noData" />
      </div>
    );

  return (
    <section>
      {/* ================= Tip Info ================= */}

      <Descriptions
        bordered
        column={2}
        className="py-3"
        title={
          <h3 className="mb-0 font-semibold text-[#3bab7b]">
            <FormattedMessage id="tipDetails" />
          </h3>
        }
      >
        <Descriptions.Item label={<FormattedMessage id="tipsId" />}>
          {displayValue(data.id)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="reference" />}>
          {displayValue(data.reference)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="amount" />}>
          {displayValue(`${data.amount} ${data.currency}`)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="statusTips" />}>
          <Tag color="green">{data.status_label}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="anonymous" />}>
          {data.is_anonymous ? (
            <Tag color="blue">
              <FormattedMessage id="yes" />
            </Tag>
          ) : (
            <Tag>
              <FormattedMessage id="no" />
            </Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="recipientType" />}>
          <FormattedMessage id={recipientTypeMap[data.recipient_type]} />
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="message" />} span={2}>
          {displayValue(data.message)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="createdAt" />}>
          {displayValue(data.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="createdAtHuman" />}>
          {displayValue(data.created_at_human)}
        </Descriptions.Item>
      </Descriptions>

      {/* <Divider /> */}

      {/* ================= Donor ================= */}

      <Descriptions
        bordered
        column={2}
        className="py-3"
        title={
          <h3 className="mb-0 font-semibold text-[#3bab7b]">
            <FormattedMessage id="donorInfo" />
          </h3>
        }
      >
        <Descriptions.Item label={<FormattedMessage id="donorName" />}>
          {displayValue(data.donor?.name)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="donorType" />}>
          <FormattedMessage id={userTypeMap[data.donor?.type]} />
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="donorEmail" />}>
          {displayValue(data.donor?.email)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="donorPhone" />}>
          {displayValue(data.donor?.phone)}
        </Descriptions.Item>
      </Descriptions>

      {/* <Divider /> */}

      {/* ================= Recipient ================= */}

      <Descriptions
        bordered
        className="py-3"
        column={2}
        title={
          <h3 className="mb-0 font-semibold text-[#3bab7b]">
            <FormattedMessage id="recipientInfo" />
          </h3>
        }
      >
        <Descriptions.Item label={<FormattedMessage id="recipientName" />}>
          {displayValue(data.recipient?.name)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="recipientType" />}>
          {data.recipient ? <FormattedMessage id={userTypeMap[data.recipient.type]} /> : '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="recipientEmail" />}>
          {displayValue(data.recipient?.email)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="recipientPhone" />}>
          {displayValue(data.recipient?.phone)}
        </Descriptions.Item>
      </Descriptions>

      {/* <Divider /> */}

      {/* ================= Payment ================= */}

      <Descriptions
        className="py-3"
        bordered
        column={2}
        title={
          <h3 className="mb-0 font-semibold text-[#3bab7b]">
            <FormattedMessage id="paymentInfo" />
          </h3>
        }
      >
        <Descriptions.Item label={<FormattedMessage id="paymentId" />}>
          {displayValue(data.payment?.id)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="transactionId" />}>
          {displayValue(data.payment?.transaction_id)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="paymentMethod" />}>
          {displayValue(data.payment?.payment_method)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="paymentStatus" />}>
          {renderPaymentStatus(data.payment?.status)}
        </Descriptions.Item>
      </Descriptions>

      {/* <Divider /> */}

      {/* ================= Breakdown ================= */}

      <Descriptions
        bordered
        className="py-3"
        column={2}
        title={
          <h3 className="mb-0 font-semibold text-[#3bab7b]">
            <FormattedMessage id="breakdown" />
          </h3>
        }
      >
        {data.breakdown?.details?.map((item, index) => (
          <Descriptions.Item
            key={index}
            label={intl.locale.startsWith('ar') ? item.label_ar : item.label}
          >
            {item.amount} {data.currency}
          </Descriptions.Item>
        ))}
      </Descriptions>

      {/* <Divider /> */}

      {/* ================= Transactions ================= */}

      <h3 className="mb-2 pt-3 font-semibold text-[#3bab7b]">
        <FormattedMessage id="transactions" />
      </h3>

      <Table
        columns={transactionColumns}
        dataSource={data.transactions || []}
        rowKey={(_, index) => String(index)}
        pagination={false}
      />
    </section>
  );
}

export default TipsDetails;

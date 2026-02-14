import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'utlis/library/helpers/axios';
import { Descriptions, message, Tag } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';

/* ================= Types ================= */
interface TransactionDetailsType {
  id: number;
  transaction_type: number;
  amount: string;
  created_at: string;
  message: string | null;
  is_anonymous: boolean;
  recipient: any;
  donor: any;
}

/* ================= Component ================= */
function TransactionDetails() {
  const { id } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState<TransactionDetailsType | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= Transaction Map ================= */
  const TRANSACTION_TYPE_MAP: Record<number, { key: string; color: string }> = {
    1: { key: 'transaction.type.deposit', color: 'green' },
    2: { key: 'transaction.type.tipReceived', color: 'blue' },
    3: { key: 'transaction.type.tipSent', color: 'purple' },
    4: { key: 'transaction.type.adminFee', color: 'orange' },
    5: { key: 'transaction.type.employerFee', color: 'gold' },
    6: { key: 'transaction.type.withdrawal', color: 'red' },
    7: { key: 'transaction.type.withdrawalBack', color: 'cyan' },
  };

  /* ================= Helpers ================= */
  const displayValue = (value: any) =>
    value ? (
      <span className="text-[#3bab7b]">{value}</span>
    ) : (
      <span className="text-gray-300">
        <FormattedMessage id="noData" />
      </span>
    );

  const label = (id: string) => (
    <b className="text-[#3bab7b] font-semibold">
      {intl.formatMessage({ id })}
    </b>
  );

  /* ================= Fetch ================= */
  const fetchDetails = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get(`/back/employer/transactions/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data);
    } catch {
      message.error(
        intl.formatMessage({ id: 'fetchTransactionDetailsFailed' })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id, intl.locale]);

  /* ================= States ================= */
  if (loading) return <RollerLoading />;

  if (!data)
    return (
      <div className="text-center mt-10 text-gray-400">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= JSX ================= */
  return (
    <section>
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item label={label('transactionId')}>
          {displayValue(data.id)}
        </Descriptions.Item>

        <Descriptions.Item label={label('transactionType')}>
          <Tag
            className="px-2 py-1"
            color={
              TRANSACTION_TYPE_MAP[data.transaction_type]?.color || 'default'
            }
          >
            <FormattedMessage
              id={
                TRANSACTION_TYPE_MAP[data.transaction_type]?.key ||
                'transaction.type.unknown'
              }
            />
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={label('amount')}>
          {displayValue(data.amount)}
        </Descriptions.Item>

        <Descriptions.Item label={label('createdAt')}>
          {displayValue(data.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={label('isAnonymous')}>
          <Tag
            className="px-2 py-1"
            color={data.is_anonymous ? 'red' : 'green'}
          >
            {data.is_anonymous
              ? intl.formatMessage({ id: 'yes' })
              : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={label('message')}>
          {displayValue(data.message)}
        </Descriptions.Item>

        <Descriptions.Item label={label('donor')}>
          {displayValue(data.donor)}
        </Descriptions.Item>

        <Descriptions.Item label={label('recipient')}>
          {displayValue(data.recipient)}
        </Descriptions.Item>
      </Descriptions>
    </section>
  );
}

export default TransactionDetails;

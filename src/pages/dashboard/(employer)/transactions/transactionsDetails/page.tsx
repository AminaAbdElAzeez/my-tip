import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "utlis/library/helpers/axios";
import { Descriptions, message, Tag, Tooltip } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FiArrowLeft } from "react-icons/fi";

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

  /* ================= Helpers ================= */
  const displayValue = (value: any) =>
    value ? (
      <span className="text-[#3bab7b]">{value}</span>
    ) : (
      <span className="text-gray-300">
        <FormattedMessage id="noData" />
      </span>
    );

  /* ================= Fetch ================= */
  const fetchDetails = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get(`/back/employer/transactions/${id}`, {
        headers: { "Accept-Language": lang },
      });

      setData(res.data?.data);
    } catch {
      message.error(
        intl.formatMessage({ id: "fetchTransactionDetailsFailed" }),
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
      {/* Details Table */}
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item label={intl.formatMessage({ id: "transactionId" })}>
          {displayValue(data.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={intl.formatMessage({ id: "transactionType" })}
        >
          {displayValue(data.transaction_type)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "amount" })}>
          {displayValue(data.amount)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "createdAt" })}>
          {displayValue(data.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "isAnonymous" })}>
          <Tag color={data.is_anonymous ? "red" : "green"}>
            {data.is_anonymous
              ? intl.formatMessage({ id: "yes" })
              : intl.formatMessage({ id: "no" })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "message" })}>
          {displayValue(data.message)}
        </Descriptions.Item>

        <Descriptions.Item label="Donor">
          {displayValue(data.donor)}
        </Descriptions.Item>

        <Descriptions.Item label="Recipient">
          {displayValue(data.recipient)}
        </Descriptions.Item>
      </Descriptions>
    </section>
  );
}

export default TransactionDetails;

import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Tooltip, message, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEye } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { useNavigate } from 'react-router-dom';

/* ================= Types ================= */
interface Transaction {
  id: number;
  transaction_type: number;
  name: string;
  amount: string;
  created_at: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total_send: number;
  total_received: number;
}

/* ================= Component ================= */
function Transactions() {
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({
    total_send: 0,
    total_received: 0,
  });

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  /* ================= Fetch ================= */
  const fetchTransactions = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/employer/transactions', {
        params: { page, per_page: perPage },
        headers: { 'Accept-Language': lang },
      });

      const responseData: TransactionsResponse = res.data?.data;

      setData(responseData?.transactions || []);
      setTotals({
        total_send: responseData?.total_send || 0,
        total_received: responseData?.total_received || 0,
      });

      setPagination({
        current: res.data?.pagination?.current_page,
        pageSize: res.data?.pagination?.per_page,
        total: res.data?.pagination?.total,
      });

      message.success(res.data?.message);
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'fetchTransactionsFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [intl.locale]);

  /* ================= Columns ================= */
  const columns: ColumnsType<Transaction> = [
    {
      title: intl.formatMessage({ id: 'transactionId' }),
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: 'center',
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: 'transactionType' }),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      align: 'center',
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: 'amount' }),
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      align: 'center',
      render: (text) => (text ? `${text} SAR` : <FormattedMessage id="noData" />),
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      key: 'created_at',
      width: '25%',
      align: 'center',
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      align: 'center',
      width: '15%',
      render: (_, record) =>
        record.transaction_type === 5 ? (
          <Tooltip title={intl.formatMessage({ id: 'viewTransaction' })} color="#a86b9e">
            <AiOutlineEye
              className="text-[#a86b9e] text-2xl cursor-pointer"
              onClick={() => navigate(`/employer/transactions/${record.id}`)}
            />
          </Tooltip>
        ) : (
          <FormattedMessage id="noData" />
        ),
    },
  ];

  /* ================= JSX ================= */
  return (
    <div className="pt-3">
      {loading ? (
        <RollerLoading />
      ) : (
        <>
          {/* Totals */}
          <div className="flex gap-4 mb-4">
            <Card className="w-1/2 text-center">
              <p className="text-gray-500">
                <FormattedMessage id="totalSend" />
              </p>
              <h3 className="text-xl font-bold text-red-500">{totals.total_send} SAR</h3>
            </Card>

            <Card className="w-1/2 text-center">
              <p className="text-gray-500">
                <FormattedMessage id="totalReceived" />
              </p>
              <h3 className="text-xl font-bold text-green-600">{totals.total_received} SAR</h3>
            </Card>
          </div>

          {/* Table */}
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            scroll={{ x: 1000 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: ['10', '15', '20', '50', '100'],
              onChange: (page, size) => {
                fetchTransactions(page, size);
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default Transactions;

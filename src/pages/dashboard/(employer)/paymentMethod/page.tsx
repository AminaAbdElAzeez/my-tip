import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
  Select,
  Radio,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineEye } from "react-icons/ai";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FiTrash } from "react-icons/fi";

interface PaymentMethod {
  id: number;
  type: string;
  payment_type: number;

  label: string | null;

  payment_brand: number | null;

  card_last_four: string | null;
  masked_card: string | null;
  card_exp_month: number | null;
  card_exp_year: number | null;
  card_holder_name: string | null;

  iban: string | null;
  bank_name: string | null;
  holder_name: string | null;
  account_number: string | null;

  wallet_phone: string | null;
  device_name: string | null;

  is_default: boolean;
  is_active: boolean;
}

interface Bank {
  id: number;
  name: string;
  logo: string;
}

function PaymentMethods() {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const intl = useIntl();
  const [addForm] = Form.useForm();

  const paymentBrandMap: Record<number, string> = {
    1: intl.formatMessage({ id: "visa" }),
    2: intl.formatMessage({ id: "mastercard" }),
    3: intl.formatMessage({ id: "mada" }),
    4: intl.formatMessage({ id: "applePay" }),
    5: intl.formatMessage({ id: "stcPay" }),
  };

  /* ================= Fetch Payment Methods ================= */
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get("/payment-methods", {
        headers: { "Accept-Language": lang },
      });
      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchPaymentMethods" }));
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get("/payment-methods/banks", {
        headers: { "Accept-Language": lang },
      });
      setBanks(res.data?.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchBanks();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchPaymentMethods();
    fetchBanks();
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

  /* ================= Delete Payment Method ================= */
  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.delete(`/payment-methods/${id}`, {
        headers: { "Accept-Language": lang },
      });
      message.success(
        res.data?.message || intl.formatMessage({ id: "delSuccess" }),
      );
      fetchPaymentMethods();
      setDeleteModalOpen(false);
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "delFailed" }));
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= Table Columns ================= */
  const columns: ColumnsType<PaymentMethod> = [
    {
      title: intl.formatMessage({ id: "paymentMethodId" }),
      dataIndex: "id",
      key: "id",
      width: "6%",
      align: "center",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "paymentType" }),
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "5%",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    // {
    //   title: intl.formatMessage({ id: 'type' }),
    //   dataIndex: 'type',
    //   key: 'type',
    //   width: '4%',
    //   align: 'center',
    //   render: (val) =>
    //     val ?? (
    //       <p className="text-gray-300">
    //         <FormattedMessage id="noData" />
    //       </p>
    //     ),
    // },
    {
      title: intl.formatMessage({ id: "label" }),
      dataIndex: "label",
      key: "label",
      width: "5%",
      align: "center",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "paymentBrand" }),
      dataIndex: "payment_brand",
      key: "payment_brand",
      align: "center",
      width: "7%",

      render: (val) =>
        val ? (
          paymentBrandMap[val] || val
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "cardLastFour" }),
      dataIndex: "card_last_four",
      key: "card_last_four",
      align: "center",
      width: "5%",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "maskedCard" }),
      dataIndex: "masked_card",
      key: "masked_card",
      align: "center",
      width: "6%",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "cardExp" }),
      dataIndex: "card_exp_month",
      key: "card_exp_month",
      width: "7%",

      align: "center",
      render: (_, record) =>
        record.card_exp_month && record.card_exp_year ? (
          `${record.card_exp_month}/${record.card_exp_year}`
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "cardHolderName" }),
      dataIndex: "card_holder_name",
      key: "card_holder_name",
      align: "center",
      width: "6%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "deviceName" }),
      dataIndex: "device_name",
      key: "device_name",
      align: "center",
      width: "6%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "isDefault" }),
      dataIndex: "is_default",
      key: "is_default",
      align: "center",
      width: "4%",

      render: (val) =>
        val
          ? intl.formatMessage({ id: "yes" })
          : intl.formatMessage({ id: "no" }),
    },
    {
      title: intl.formatMessage({ id: "isActive" }),
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      width: "4%",

      render: (val) =>
        val
          ? intl.formatMessage({ id: "yes" })
          : intl.formatMessage({ id: "no" }),
    },

    {
      title: intl.formatMessage({ id: "walletPhone" }),
      dataIndex: "wallet_phone",
      key: "wallet_phone",
      align: "center",
      width: "5%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "iban" }),
      dataIndex: "iban",
      key: "iban",
      align: "center",
      width: "8%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "bankName" }),
      dataIndex: "bank_name",
      key: "bank_name",
      width: "7%",

      align: "center",
      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "holderName" }),
      dataIndex: "holder_name",
      key: "holder_name",
      align: "center",
      width: "6%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "accountNumber" }),
      dataIndex: "account_number",
      key: "account_number",
      align: "center",
      width: "6%",

      render: (val) =>
        val ?? (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "actions" }),
      key: "actions",
      align: "center",
      width: "3%",
      fixed: "right",

      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip
            title={intl.formatMessage({ id: "deletePayment" })}
            color="#d30606"
          >
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

  /* ================= JSX ================= */
  return (
    <>
      <div className="pt-3">
        {loading ? (
          <RollerLoading />
        ) : (
          <Table
            title={() => (
              <Tooltip
                title={intl.formatMessage({ id: "addPaymentMethod" })}
                color="#3bab7b"
              >
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
            rowKey="id"
            dataSource={paginatedData}
            scroll={{ x: 3000, y: 375 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data.length,
              showSizeChanger: true,
              pageSizeOptions: ["10", "15", "20", "50", "100"],
              onChange: (page, size) => {
                setPagination({ current: page, pageSize: size! });
              },
            }}
            onChange={handleTableChange}
          />
        )}
      </div>

      {/* ================= Delete Modal ================= */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deletePayment" />
        </h3>
        <FormattedMessage id="deleteConfirmPayment" />
      </Modal>

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
            formData.append("payment_type", values.payment_type);
            formData.append("phone", values.wallet_phone);
            // formData.append("brand_type", values.brand_type);
            formData.append("code", values.code);
            formData.append("iban", values.iban);
            formData.append("bank_id", values.bank_id);
            formData.append("holder_name", values.holder_name);
            formData.append("account_number", values.account_number);

            // always 5
            formData.append("brand_type", "5");

            const lang = intl.locale.startsWith("ar") ? "ar" : "en";

            const res = await axios.post(
              "/payment-methods/create-withdraw",
              formData,
              {
                headers: { "Accept-Language": lang },
              },
            );
            message.success(
              res.data?.message ||
                intl.formatMessage({ id: "addPaymentFailed" }),
            );
            fetchPaymentMethods();
            addForm.resetFields();
            setIsAddModalOpen(false);
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "errorMsg" }),
            );
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="addPaymentMethod" />
        </h2>
        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="payment_type"
            label={<FormattedMessage id="paymentMehodType" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "paymentTypeReq2" }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "selectPaymentType" })}
              options={[
                {
                  value: 2,
                  label: intl.formatMessage({ id: "mobilePay" }),
                },
                {
                  value: 3,
                  label: intl.formatMessage({ id: "bankAccount" }),
                },
              ]}
            />
          </Form.Item>

          {/* Card */}
          {/* <Form.Item
            name="label"
            label={<FormattedMessage id="label" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'labelReq' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'label' })} />
          </Form.Item> */}

          {/* Mobile Wallet */}
          <Form.Item
            name="wallet_phone"
            label={<FormattedMessage id="walletPhone" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "walletPhoneReq" }),
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                  if (emailRegex.test(value) || saudiPhoneRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: "invalidPhone" })),
                  );
                },
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "walletPhone" })}
              addonAfter={
                <Button
                  type="primary"
                  size="middle"
                  className="w-full"
                  onClick={async () => {
                    const phone = addForm.getFieldValue("wallet_phone");
                    if (!phone)
                      return message.error(
                        intl.formatMessage({ id: "walletPhoneReq" }),
                      );
                    try {
                      const lang = intl.locale.startsWith("ar") ? "ar" : "en";
                      const res = await axios.post(
                        "/payment-methods/send-code",
                        { phone },
                        {
                          headers: { "Accept-Language": lang },
                        },
                      );
                      message.success(
                        res.data.message ||
                          intl.formatMessage({ id: "codeSentSuccess" }),
                      );
                    } catch (err: any) {
                      message.error(
                        err.message ||
                          intl.formatMessage({ id: "codeSentFailed" }),
                      );
                    }
                  }}
                >
                  <FormattedMessage id="sendCode" />
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={<FormattedMessage id="code" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "codeReq" }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "code" })} />
          </Form.Item>

          {/* <Form.Item
            name="brand_type"
            label={<FormattedMessage id="brandType" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "brandTypeReq" }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "brandType" })} />
          </Form.Item> */}

          {/* Bank Account */}
          <Form.Item
            name="iban"
            label={<FormattedMessage id="iban" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "ibanReq" }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "iban" })} />
          </Form.Item>

          <Form.Item
            name="bank_id"
            label={<FormattedMessage id="bankName" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "bankReq" }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "bankName" })}
              options={banks.map((b) => ({ value: b.id, label: b.name }))}
            />
          </Form.Item>

          <Form.Item
            name="holder_name"
            label={<FormattedMessage id="holderName" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "holderNameReq" }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "holderName" })} />
          </Form.Item>

          <Form.Item
            name="account_number"
            label={<FormattedMessage id="accountNumber" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "accountNumberReq" }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "accountNumber" })} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PaymentMethods;

import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Card, Button, Modal, Form, Input, Select, message } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { BiDollar } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { LiaUsersSolid } from "react-icons/lia";
import { PiUsersFourFill } from "react-icons/pi";

/* ================= Types ================= */

interface WalletData {
  wallet_balance: string;
  wallet_last_update: string;
}

interface WalletResponse {
  wallet_data: WalletData;
  total_tips: string;
  total_persons: number;
  minimum_withdraw: number;
}

interface PaymentMethod {
  id: number;
  payment_type: number;
  wallet_phone?: string;
  iban?: string;
  holder_name?: string;
}

/* ================= Component ================= */

function Wallet() {
  const intl = useIntl();

  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [form] = Form.useForm();

  /* ================= Helpers ================= */

  const formatNumber = (value: any) => {
    if (!value && value !== 0) return null;
    return intl.formatNumber(Number(value));
  };

  const formatDate = (value: string) => {
    if (!value) return null;
    return intl.formatDate(new Date(value), {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayValue = (value: any) =>
    value || value === 0 ? value : <FormattedMessage id="noData" />;

  /* ================= Fetch Wallet ================= */

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get("/back/employer/wallet", {
        headers: { "Accept-Language": lang },
      });

      setWallet(res.data?.data);
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get("/payment-methods");
      setPaymentMethods(res.data?.data || []);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchPaymentMethods();
  }, [intl.locale]);

  /* ================= Withdraw ================= */

  const submitWithdraw = async () => {
    try {
      setWithdrawLoading(true);

      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("amount", values.amount);
      formData.append("payment_method_id", values.payment_method_id);

      const res = await axios.post("/withdrawals", formData);

      if (res.data?.status) {
        message.success(intl.formatMessage({ id: "withdrawSuccess" }));
        setWithdrawOpen(false);
        form.resetFields();
        fetchWallet();
      } else {
        message.error(res.data?.message);
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) return <RollerLoading />;
  if (!wallet) return null;

  /* ================= Styled Stat Cards ================= */

  const cards = [
    {
      title: intl.formatMessage({ id: "walletBalance" }),
      value: formatNumber(wallet.wallet_data.wallet_balance),
      icon: <FaWallet className="text-xl text-[#3bab7b]" />,
    },
    {
      title: intl.formatMessage({ id: "walletLastUpdate" }),
      value: wallet.wallet_data.wallet_last_update,
      icon: <FaCalendarAlt className="text-xl text-[#B172A7]" />,
    },
    {
      title: intl.formatMessage({ id: "totalTips" }),
      value: wallet.total_tips,
      icon: <BiDollar className="text-xl text-[#ecc351]" />,
    },
    {
      title: intl.formatMessage({ id: "totalPersons" }),
      value: wallet.total_persons,
      icon: <PiUsersFourFill className="text-xl text-[#ec6341]" />,
    },
    {
      title: intl.formatMessage({ id: "minimumWithdraw" }),
      value: formatNumber(wallet.minimum_withdraw),
      icon: <GiTwoCoins className="text-xl text-[#4da3d8]" />,
    },
  ];

  const colors = ["#3bab7b", "#B172A7", "#ecc351", "#ec6341", "#4da3d8"];

  return (
    <section className="p-3 pt-2">
      <h1 className="text-2xl font-bold mb-4 text-[#3bab7b]">
        <FormattedMessage id="wallet" />
      </h1>

      {/* ================= Cards ================= */}

      <div className="flex flex-wrap gap-4 mb-6">
        {cards.map((card, idx) => (
          <div key={idx} style={{ flex: "1 1 300px" }}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="shadow-sm h-full text-white cursor-grab py-1"
                style={{ backgroundColor: colors[idx] }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">{card.title}</span>

                  <div className="w-9 h-9 rounded-full bg-white flex justify-center items-center">
                    {card.icon}
                  </div>
                </div>

                <h2 className="text-lg font-medium">
                  {displayValue(card.value)}
                </h2>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ================= Withdraw Button ================= */}

      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          className="w-36 h-10  text-lg flex justify-center items-center gap-2"
          onClick={() => setWithdrawOpen(true)}
        >
          <FaPlus className="text-base" />
          <FormattedMessage id="withdraw" />
        </Button>
      </div>

      {/* ================= Withdraw Modal ================= */}

      <Modal
        open={withdrawOpen}
        confirmLoading={withdrawLoading}
        onCancel={() => setWithdrawOpen(false)}
        onOk={submitWithdraw}
      >
        <h3 className="text-[#3bab7b] text-xl mb-4">
          <FormattedMessage id="withdraw" />
        </h3>

        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label={intl.formatMessage({ id: "withdrawAmount" })}
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="payment_method_id"
            label={intl.formatMessage({ id: "paymentMethod" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({
                id: "selectPaymentMethod",
              })}
            >
              {paymentMethods.map((pm) => (
                <Select.Option key={pm.id} value={pm.id}>
                  {pm.wallet_phone ||
                    pm.iban ||
                    pm.holder_name ||
                    intl.formatMessage(
                      { id: "paymentMethodNumber" },
                      { id: pm.id },
                    )}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default Wallet;

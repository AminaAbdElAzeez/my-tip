import { useState } from 'react';
import { Card, Row, Col, Select, Spin, List, Tag, Table, Skeleton } from 'antd';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  DollarOutlined,
  UserOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from 'utlis/library/helpers/axios';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { BiDollar } from 'react-icons/bi';
import { FaUser, FaWallet } from 'react-icons/fa';
import { FaArrowTrendDown, FaArrowTrendUp, FaTriangleExclamation } from 'react-icons/fa6';

const { Option } = Select;

// ================= COMPONENT =================

const Statistics = () => {
  const intl = useIntl();
  const [duration, setDuration] = useState('day');

  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language,
  );

  // ================= API =================

  const fetchDashboard = async () => {
    const res = await axios.get('/back/admin/dashboard', {
      headers: {
        'Accept-Language': locale === 'en' ? 'en' : 'ar',
      },
    });
    return res.data.data;
  };

  const fetchStatistics = async (duration: string) => {
    const res = await axios.get(`/back/admin/dashboard/statistics?filter[duration]=${duration}`, {
      headers: {
        'Accept-Language': locale === 'en' ? 'en' : 'ar',
      },
    });
    return res.data.data;
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });

  const { data: statisticsData, isLoading: chartLoading } = useQuery({
    queryKey: ['statistics', duration],
    queryFn: () => fetchStatistics(duration),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const stats = dashboardData.statistics;

  // ================= Pie Chart Data =================
  const chartData =
    statisticsData?.data?.map((item: any) => ({
      name: item.period,
      value: item.amount,
    })) || [];

  const COLORS = ['#3bab7b', '#1677ff', '#faad14', '#ff4d4f', '#9254de', '#13c2c2'];

  // ================= Pending Tables Columns =================
  const employerColumns = [
    { title: intl.formatMessage({ id: 'table.owner' }), dataIndex: 'owner_name' },
    { title: intl.formatMessage({ id: 'table.business' }), dataIndex: 'business_name' },
    { title: intl.formatMessage({ id: 'table.cr' }), dataIndex: 'commercial_register' },
    { title: intl.formatMessage({ id: 'table.submittedDate' }), dataIndex: 'submitted_date' },
  ];

  const userColumns = [
    { title: intl.formatMessage({ id: 'table.name' }), dataIndex: 'name' },
    { title: intl.formatMessage({ id: 'table.email' }), dataIndex: 'email' },
    { title: intl.formatMessage({ id: 'table.phone' }), dataIndex: 'phone' },
    { title: intl.formatMessage({ id: 'table.submittedDate' }), dataIndex: 'submitted_date' },
  ];

  // ================= STAT CARDS =================
  const statCards = [
    {
      title: intl.formatMessage({ id: 'stats.totalTips' }),
      value: stats.total_tips_today.value,
      count: stats.total_tips_today.count,
      currency: stats.total_tips_today.currency,
      change: stats.total_tips_today.change_percentage,
      trend: stats.total_tips_today.trend,
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <BiDollar className="text-xl text-[#3bab7b] " />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stats.activeUsers' }),
      value: stats.active_users.value,
      count: stats.active_users.count || 0,
      currency: '',
      change: stats.active_users.change_percentage,
      trend: stats.active_users.trend,
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <FaUser className="text-xl text-[#B172A7] " />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stats.platformRevenue' }),
      value: stats.platform_revenue.value,
      count: stats.platform_revenue.count || 0,
      currency: stats.platform_revenue.currency,
      change: stats.platform_revenue.change_percentage,
      trend: stats.platform_revenue.trend,
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <FaWallet className="text-xl text-[#ecc351] " />
        </div>
      ),
    },
  ];

  return (
    <section className="p-3">
      {/* ================= HEADER ================= */}
      <h1 className="text-xl font-bold mb-4 text-[#3bab7b]">
        <FormattedMessage id="dashboard.title" />
      </h1>

      {/* ================= STAT CARDS ================= */}
      <Row gutter={[16, 16]} className="flex gap-4 flex-wrap">
        {statCards.map((card, idx) => {
          const colors = ['#3bab7b', '#B172A7', '#ecc351'];
          const bgColor = colors[idx % colors.length];

          return (
            <div
              key={idx}
              style={{
                flex: '1 1 230px',
                maxWidth: '100%',
                display: 'flex',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1 }}
              >
                <Card
                  className="shadow-sm h-full flex flex-col justify-between text-white cursor-grab"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white text-base font-medium">{card.title}</span>
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {card.value} {card.currency}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {card.trend === 'up' ? (
                      <FaArrowTrendUp className="text-[#fff] text-lg" />
                    ) : (
                      <FaArrowTrendDown className="text-red-600 text-lg" />
                    )}
                    <span className={card.trend === 'up' ? 'text-[#fff]' : 'text-red-600'}>
                      {card.change}%
                    </span>
                    <span className="text-white text-sm">
                      ({card.count} {intl.formatMessage({ id: 'items' })})
                    </span>
                  </div>
                </Card>
              </motion.div>
            </div>
          );
        })}
      </Row>

      {/* ================= PERFORMANCE PIE CHART ================= */}
      <Card
        className="mt-6 shadow-md"
        bordered={false}
        title={
          <div className="flex justify-between items-center flex-wrap gap-3">
            <span className="font-semibold text-[#3bab7b] text-xl">
              <FormattedMessage id="analytics.title" />
            </span>
            <Select
              value={duration}
              onChange={setDuration}
              className={`min-w-[170px] h-[35px] ${locale === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <Option value="day">
                <FormattedMessage id="filter.today" />
              </Option>
              <Option value="week">
                <FormattedMessage id="filter.week" />
              </Option>
              <Option value="month">
                <FormattedMessage id="filter.month" />
              </Option>
              <Option value="year">
                <FormattedMessage id="filter.year" />
              </Option>
            </Select>
          </div>
        }
      >
        {chartLoading ? (
          <Spin />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 p-2 overflow-hidden">
            {/* ================= chart ================= */}
            <div
              className="flex-1 min-w-[288px] overflow-x-auto chart-scroll  bg-[#f0fcf5] rounded-lg p-2"
              style={{ flexShrink: 0 }}
            >
              {chartData && chartData.length > 0 ? (
                <div className="min-w-[288px]">
                  <ResponsiveContainer
                    width={chartData.length > 0 ? chartData.length * 120 : 288}
                    height={300}
                  >
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        innerRadius={80}
                        paddingAngle={4}
                      >
                        {chartData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-10">
                  <FaTriangleExclamation className="text-6xl text-[#3bab7b]" />
                </div>
              )}
            </div>

            {/* ================= Details ================= */}
            <div className="flex-1 flex flex-col gap-4">
              {chartData && chartData.length > 0 ? (
                chartData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-[#f0fcf5] p-3 rounded shadow-sm"
                  >
                    <div>
                      <p
                        className="font-medium text-[17px] mb-1"
                        style={{ color: COLORS[idx % COLORS.length] }}
                      >
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 flex flex-col min-[400px]:flex-row gap-0.5 min-[400px]:gap-6">
                        {item.value} SAR{' '}
                        <span dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                          {statisticsData?.data[idx]?.count || 0}{' '}
                          {intl.formatMessage({ id: 'items' })}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {statisticsData?.data[idx]?.period_date || ''}
                      </p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-10">
                  <FormattedMessage
                    id="analytics.noData"
                    defaultMessage="No data available for this period"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ================= RECENT ACTIVITY ================= */}
      <Card
        title={<FormattedMessage id="activity.recent" />}
        className="mt-6 shadow-sm"
        bordered={false}
      >
        <List
          dataSource={dashboardData.recent_activity}
          renderItem={(item: any) => (
            <List.Item className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.title}</p>
                <small className="text-gray-500">
                  <FormattedMessage id={`activity.type.${item.type}`} defaultMessage={item.type} />{' '}
                  • {item.timestamp} • {item.time_ago}
                </small>
              </div>
              <Tag color="blue" className="font-bold">
                {item.data.amount} SAR
              </Tag>
            </List.Item>
          )}
        />
      </Card>

      {/* ================= PENDING APPROVALS ================= */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card
            title={<FormattedMessage id="pending.employers" />}
            bordered={false}
            className="shadow-sm"
          >
            <Table
              size="small"
              rowKey="id"
              dataSource={dashboardData.pending_employer_approvals}
              columns={employerColumns}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={<FormattedMessage id="pending.users" />}
            bordered={false}
            className="shadow-sm"
          >
            <Table
              size="small"
              rowKey="id"
              dataSource={dashboardData.pending_user_approvals}
              columns={userColumns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* ================= BALANCE ================= */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <h4 className="text-gray-500">
              <FormattedMessage id="balance.total" />
            </h4>
            <h2 className="text-2xl font-bold text-[#3bab7b]">
              {dashboardData.balance.total_balance} SAR
            </h2>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <h4 className="text-gray-500">
              <FormattedMessage id="balance.adminProfit" />
            </h4>
            <h2 className="text-2xl font-bold text-green-600">
              {dashboardData.balance.admin_profits} SAR
            </h2>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Statistics;

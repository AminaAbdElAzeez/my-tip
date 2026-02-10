import { useState } from 'react';
import { Card, Row, Col, Select, Spin, List, Tag, Table, Skeleton } from 'antd';

import { ResponsiveContainer, Tooltip, AreaChart, XAxis, YAxis, Area } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from 'utlis/library/helpers/axios';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { BiDollar } from 'react-icons/bi';
import { FaCoins, FaUser, FaWallet, FaWaveSquare } from 'react-icons/fa';
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaTriangleExclamation,
  FaUsersGear,
} from 'react-icons/fa6';
import RollerLoading from 'components/loading/roller';
import { GiTwoCoins } from 'react-icons/gi';
import { Tooltip as AntdTooltip } from 'antd';

const { Option } = Select;

// ================= COMPONENT =================

const EmployerStatistics = () => {
  const intl = useIntl();
  const [duration, setDuration] = useState('day');

  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language,
  );

  // ================= API =================

  const fetchDashboard = async () => {
    const res = await axios.get('/back/employer/dashboard', {
      headers: {
        'Accept-Language': locale === 'en' ? 'en' : 'ar',
      },
    });
    return res.data.data;
  };

  const fetchStatistics = async (duration: string) => {
    const res = await axios.get(
      `/back/employer/dashboard/statistics?filter[duration]=${duration}`,
      {
        headers: {
          'Accept-Language': locale === 'en' ? 'en' : 'ar',
        },
      },
    );
    return res.data.data;
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', locale],
    queryFn: fetchDashboard,
  });

  const { data: statisticsData, isLoading: chartLoading } = useQuery({
    queryKey: ['statistics', duration, locale],
    queryFn: () => fetchStatistics(duration),
  });

  if (isLoading) {
    return <RollerLoading />;
  }

  const stats = dashboardData?.statistics;

  // ================= Pie Chart Data =================
  const chartData =
    statisticsData?.data?.map((item: any) => ({
      name: item.period,
      value: item.amount,
      count: item.count,
    })) || [];

  // const COLORS = ['#3bab7b', '#1677ff', '#faad14', '#ff4d4f', '#9254de', '#13c2c2'];

  // ================= STAT CARDS =================
  const statCards = [
    {
      title: intl.formatMessage({ id: 'stats.totalTipsToday' }),
      value: stats?.total_tips_today?.value ?? 0,
      count: stats?.total_tips_today?.count ?? 0,
      currency: stats?.total_tips_today?.currency ?? '',
      change: stats?.total_tips_today?.change_percentage ?? 0,
      trend: stats?.total_tips_today?.trend ?? 'up',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <BiDollar className="text-xl text-[#3bab7b]" />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stats.tipsCountToday' }),
      value: stats?.tips_count_today?.value ?? 0,
      // count: 0,
      // currency: '',
      change: stats?.tips_count_today?.change_percentage ?? 0,
      trend: stats?.tips_count_today?.trend ?? 'up',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <FaCoins className="text-xl text-[#B172A7]" />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stats.averageTip' }),
      value: stats?.average_tip?.value ?? 0,
      // count: 0,
      currency: stats?.average_tip?.currency ?? '',
      change: stats?.average_tip?.change_percentage ?? 0,
      trend: stats?.average_tip?.trend ?? 'up',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <FaWaveSquare className="text-xl text-[#ecc351]" />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stats.totalEmployees' }),
      value: stats?.total_employees?.value ?? 0,
      // count: stats?.total_tips_today?.count ?? 0,
      // currency: stats?.total_tips_today?.currency ?? '',
      // change: stats?.total_tips_today?.change_percentage ?? 0,
      // trend: stats?.total_tips_today?.trend ?? 'up',
      icon: (
        <div className="w-9 h-9 rounded-full bg-[#fff] flex justify-center items-center">
          <FaUsersGear className="text-xl text-[#4da3d8]" />
        </div>
      ),
    },
  ];

  // case statistics filter return one value
  const formatPeriodLabel = (period: string, duration: string, locale: string) => {
    if (duration === 'year') {
      return period;
    }

    if (duration === 'month') {
      const [year, month] = period.split('-');
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
      }).format(new Date(Number(year), Number(month) - 1));
    }

    // day
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(period));
  };

  // tooltip in Area chart
  // ================= FORMATTED CHART DATA =================
  const formattedChartData =
    statisticsData?.data?.map((item: any) => ({
      name: item.period, // XAxis
      value: item.amount, // Area value
      count: item.count, // Tooltip count
    })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const { value, count } = payload[0].payload;

    return (
      <div className="bg-white border border-gray-300 rounded p-2 shadow-md text-[#243636] min-w-[160px]">
        <div className="mb-1 font-semibold">{formatPeriodLabel(label, duration, intl.locale)}</div>

        <div className="flex justify-between">
          <span>
            <FormattedMessage id="amount" />
          </span>
          <span>{intl.formatNumber(value)}</span>
        </div>

        <div className="flex justify-between">
          <span>
            <FormattedMessage id="itemsChart" />
          </span>
          <span>{intl.formatNumber(count)}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="p-3 pt-2">
      {/* ================= HEADER ================= */}
      <h1 className="text-[21px] sm:text-2xl font-bold mb-3 text-[#3bab7b]">
        <FormattedMessage id="dashboard.title" />
      </h1>

      {/* ================= STAT CARDS ================= */}
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <Row gutter={[0, 16]} className="flex gap-4 flex-wrap w-full xl:w-2/3">
          {statCards.map((card, idx) => {
            const colors = ['#3bab7b', '#B172A7', '#ecc351',"#4da3d8"];
            const bgColor = colors[idx % colors.length];

            return (
              <div
                key={idx}
                style={{
                  flex: '1 1 270px',
                  maxWidth: '100%',
                  display: 'flex',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
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
                      {card.trend ? (
                        card.trend === 'up' ? (
                          <FaArrowTrendUp className="text-white text-lg" />
                        ) : (
                          <FaArrowTrendDown className="text-red-600 text-lg" />
                        )
                      ) : null}

                      {card.trend ? (
                        <span className={card.trend === 'up' ? 'text-[#fff]' : 'text-red-600'}>
                          {card.change}%
                        </span>
                      ) : null}
                      {typeof card.count === 'number' && (
                        <span className="text-white text-sm">
                          ({card.count} {intl.formatMessage({ id: 'items' })})
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </Row>

        <Card className="w-full xl:w-1/3 hover:shadow transition-all duration-500 sm:min-w-[250px]">
          <h4 className="text-[#2AB479] text-xl font-semibold mb-1.5">
            <FormattedMessage id="myCard" />
          </h4>
          <h5 className="text-[#333333] text-lg font-normal mb-1">
            <FormattedMessage id="totalTips" />
          </h5>
          <h3 className="text-[#333333] text-[20px] flex items-center gap-1.5 mb-3">
            {dashboardData.balance?.total_tips ?? 0}{' '}
            {dashboardData.balance?.currency && (
              <img src="/black.svg" alt="tips" className="w-5 h-5" />
            )}
          </h3>
          <div
            className="hover:scale-[1.04] transition-all duration-500 cursor-grab !bg-[#2DB970] w-full h-[120px] !bg-no-repeat rounded-lg !bg-cover mb-2"
            style={{ background: 'url("/cardLayer.svg")' }}
          >
            <div className="p-3 flex justify-between items-start">
              <div className="w-[60%]">
                <h6 className="text-[#F1F1F1] font-normal text-base sm:text-lg">
                  <FormattedMessage id="availableBalance" />
                </h6>
                <h3 className="text-[#F1F1F1] text-[20px] flex items-center gap-1.5 mb-2">
                  {dashboardData.balance?.available_balance ?? 0}
                  {dashboardData.balance?.currency && (
                    <img src="/white.svg" alt="Total Balance" className="w-5 h-5" />
                  )}
                </h3>
                <p className="text-[#E8FFF5] text-sm">
                  <FormattedMessage id="pendingBalance" />:
                  <span className="font-semibold ms-1">
                    {dashboardData.balance?.pending_balance ?? 0}
                  </span>
                </p>
              </div>
              <img src="/mastercard.svg" alt="Matar Card" className="w-14 sm:w-[60px] h-auto" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col xl:flex-row justify-between gap-4">
        {/* ================= PERFORMANCE PIE CHART ================= */}
        <Card
          className="mt-6 shadow-md w-full xl:w-2/3"
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
            <div className="flex justify-center items-center h-[350px]">
              <Skeleton active paragraph={{ rows: 6 }} title={false} className="w-full" />
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto custom-scroll bg-[#f0fcf5] rounded-lg p-2  ">
              {chartData && chartData.length > 0 ? (
                <div
                  style={{
                    minWidth: Math.max(formattedChartData.length * 80, 400),
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={formattedChartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3bab7b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3bab7b" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="name"
                        tickMargin={10}
                        tick={{ fontSize: 12 }}
                        reversed={locale === 'ar'}
                        tickFormatter={(value) => formatPeriodLabel(value, duration, intl.locale)}
                      />

                      <YAxis
                        tickMargin={locale === 'ar' ? 48 : 6}
                        tickFormatter={(v) => intl.formatNumber(v)}
                      />

                      <Tooltip content={CustomTooltip} />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3bab7b"
                        strokeWidth={2}
                        fill="url(#colorValue)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-gray-400 h-[350px] flex flex-col justify-center items-center gap-2">
                  <FaTriangleExclamation className="text-6xl text-[#3bab7b]" />
                  <p className="text-[17px]">
                    <FormattedMessage
                      id="analytics.noData"
                      // defaultMessage="No data available for this period"
                    />
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ================= RECENT ACTIVITY ================= */}
        <Card
          title={
            <h4 className="text-[#2AB479] font-semibold text-lg">
              <FormattedMessage id="activity.recent" />
            </h4>
          }
          className="mt-6 shadow-sm w-full xl:w-1/3"
          bordered={false}
        >
          <div className="max-h-[350px] overflow-y-auto custom-scroll">
            <List
              dataSource={dashboardData.recent_activity ?? []}
              renderItem={(item: any) => (
                <List.Item className="flex !items-start gap-3">
                  <img src="/avatar.svg" alt="Avatar" className="w-12 h-auto" />
                  <div className="w-[85%] flex-grow">
                    <AntdTooltip color="#2AB479" title={item.title}>
                      <h4 className="font-semibold text-[#333333] text-base line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap mb-2">
                        {item.title}
                      </h4>
                    </AntdTooltip>
                    <div className="flex justify-between items-start gap-2 ">
                      <div className="">
                        <div className="flex gap-1">
                          <span className="font-semibold text-[#2AB479]">
                            <FormattedMessage id="type" /> :
                          </span>
                          <span className="text-gray-500">{item.type}</span>
                        </div>
                      </div>
                      <Tag color="#2AB479" className="font-semibold p-1">
                        {item.data.amount}
                      </Tag>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-500">• {item.data.recipient_name}</span>
                      <span className="text-gray-500">• {item.data.branch_name}</span>

                      <span className="text-gray-500">• {item.timestamp}</span>
                      <span className="text-gray-500">• {item.time_ago}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default EmployerStatistics;

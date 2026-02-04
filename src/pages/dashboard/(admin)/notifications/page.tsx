import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, Form, Input, message, Tooltip, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaPlus } from 'react-icons/fa6';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';

const { Option } = Select;

/* ================= Types ================= */

interface User {
  id: number;
  name: string;
  type: number;
}

/* ================= Component ================= */

const Notifications = () => {
  const intl = useIntl();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  /* ================= Fetch Users ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/notifications/general/users', {
        headers: { 'Accept-Language': lang },
      });
      if (res.data?.status) {
        setUsers(res.data.data || []);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'somethingWentWrong' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchUsers();
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

  const paginatedData = users.slice(startIndex, endIndex);

  /* ================= Send Notification ================= */

  const handleSendNotification = async () => {
    try {
      setSendLoading(true);

      const values = await form.validateFields();

      const payload = {
        user_ids: values.user_ids?.length ? values.user_ids : null,
        title_ar: values.title_ar,
        title_en: values.title_en,
        content_ar: values.content_ar,
        content_en: values.content_en,
      };
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post('/back/admin/notifications/general', payload, {
        headers: { 'Accept-Language': lang },
      });

      if (res.data?.status) {
        message.success(res.data.message);
        form.resetFields();
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || intl.formatMessage({ id: 'sendFailed' }));
    } finally {
      setSendLoading(false);
    }
  };

  /* ================= Table Columns ================= */

  const columns: ColumnsType<User> = [
    {
      title: intl.formatMessage({ id: 'userId' }),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '20%',
    },
    {
      title: intl.formatMessage({ id: 'userName' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '50%',
    },
    {
      title: intl.formatMessage({ id: 'userType' }),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: '30%',
      render: (type) => {
        switch (type) {
          case 1:
            return intl.formatMessage({ id: 'admin' });
          case 2:
            return intl.formatMessage({ id: 'restaurantOwner' });
          case 3:
            return intl.formatMessage({ id: 'employee' });
          case 4:
            return intl.formatMessage({ id: 'contentCreator' });
          case 5:
            return intl.formatMessage({ id: 'customer' });
          default:
            return '-';
        }
      },
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      {location.pathname.endsWith('/notification') && (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              rowKey="id"
              dataSource={paginatedData}
              columns={columns}
              scroll={{ x: 700, y: 430 }}
              title={() => (
                <Tooltip title={intl.formatMessage({ id: 'sendNotification' })} color="#3bab7b">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    onClick={() => {
                      form.resetFields();
                      setIsAddModalOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: users.length,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onChange: (page, size) => {
                  setPagination({ current: page, pageSize: size! });
                },
              }}
              onChange={handleTableChange}
            />
          )}

          {/* ================= Send Modal ================= */}

          <Modal
            open={isAddModalOpen}
            confirmLoading={sendLoading}
            onCancel={() => setIsAddModalOpen(false)}
            onOk={handleSendNotification}
            okText={intl.formatMessage({ id: 'sendNotificationBtn' })}
          >
            <h3 className="text-[#3bab7b] font-semibold text-lg mb-3">
              <FormattedMessage id="sendNotification" />
            </h3>

            <Form form={form} layout="vertical">
              {/* Users */}

              <Form.Item
                name="user_ids"
                label={<FormattedMessage id="selectUsers" />}
                tooltip={intl.formatMessage({ id: 'emptyMeansAllUsers' })}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={intl.formatMessage({
                    id: 'selectUsersPlaceholder',
                  })}
                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Titles */}

              <Form.Item
                name="title_ar"
                label={<FormattedMessage id="titleAr" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'titleArReq' }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({ id: 'titleAr' })} />
              </Form.Item>

              <Form.Item
                name="title_en"
                label={<FormattedMessage id="titleEn" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'titleEnReq' }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({ id: 'titleEn' })} />
              </Form.Item>

              {/* Content */}

              <Form.Item
                name="content_ar"
                label={<FormattedMessage id="contentAr" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'contentArReq' }),
                  },
                ]}
              >
                <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'contentAr' })} />
              </Form.Item>

              <Form.Item
                name="content_en"
                label={<FormattedMessage id="contentEn" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'contentEnReq' }),
                  },
                ]}
              >
                <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'contentEn' })} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Notifications;

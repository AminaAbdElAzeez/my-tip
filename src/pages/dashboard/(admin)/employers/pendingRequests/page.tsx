import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { Table, Button, Modal, message, Tooltip, Form, Input, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEye } from 'react-icons/ai';
import { FiCheck, FiX } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoIosCloseCircleOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';

interface EmployerRequest {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  business_name: string;
  business_type_name: string;
  status: number;
  image: string;
  created_at: string;
  updated_at: string;
}

const EMPLOYER_STATUS_MAP: Record<number, { key: string; color: string }> = {
  1: { key: 'employer.status.pending', color: 'orange' },
  2: { key: 'employer.status.active', color: 'green' },
  3: { key: 'employer.status.inactive', color: 'red' },
  5: { key: 'employer.status.rejected', color: 'red' },
};

function PendingRequests() {
  const [data, setData] = useState<EmployerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [buttonLoadingId, setButtonLoadingId] = useState<number | null>(null);

  const intl = useIntl();
  const [rejectForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/employers/join-request', {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'failedToFetchEmployers' }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchRequests();
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

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/employers/${id}/approve`, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'approveSuccess' }));
      fetchRequests();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'approveFailed' }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/employers/${id}/reject`, {
        headers: { 'Accept-Language': lang },
      });
      message.success(res.data?.message || intl.formatMessage({ id: 'rejectSuccess' }));
      fetchRequests();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'rejectFailed' }));
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<EmployerRequest> = [
    {
      title: intl.formatMessage({ id: 'employerId' }),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '8%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'userName' }),
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
      width: '12%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'email' }),
      dataIndex: 'user_email',
      key: 'user_email',
      align: 'center',
      width: '12%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'phone' }),
      dataIndex: 'user_phone',
      key: 'user_phone',
      align: 'center',
      width: '8%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'businessName' }),
      dataIndex: 'business_name',
      key: 'business_name',
      align: 'center',
      width: '9%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'businessType' }),
      dataIndex: 'business_type_name',
      key: 'business_type_name',
      align: 'center',
      width: '8%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '9%',
      render: (status) => {
        const item = EMPLOYER_STATUS_MAP[status];
        return (
          <span className={`text-${item.color}-600`}>
            <FormattedMessage id={item.key} />
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      align: 'center',
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="Employer"
            style={{
              width: 100,
              height: 70,
              objectFit: 'cover',
              borderRadius: 8,
            }}
            preview={{
              mask: (
                <p className="flex items-center gap-1 text-white text-sm">
                  <AiOutlineEye className="text-lg" />
                  <span className="text-sm">
                    <FormattedMessage id="preview" />
                  </span>
                </p>
              ),
            }}
          />
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'createdAt' }),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: '9%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'updatedAt' }),
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      width: '9%',
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: '6%',

      render: (_, record) => {
        if (record.status !== 1) {
          const item = EMPLOYER_STATUS_MAP[record.status];

          return (
            <span className={`text-${item.color}-600 font-semibold`}>
              <FormattedMessage id={item.key} />
            </span>
          );
        }

        return (
          <div className="flex justify-center gap-2">
            <Tooltip title={intl.formatMessage({ id: 'approveEmployer' })} color="#3bab7b">
              <IoMdCheckmarkCircleOutline
                className="text-[#3bab7b] !text-3xl cursor-pointer"
                onClick={() => {
                  setSelectedRequestId(record.id);
                  setApproveModalOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title={intl.formatMessage({ id: 'rejectEmployer' })} color="#d30606ff">
              <IoIosCloseCircleOutline
                className="text-[#d30606ff] !text-3xl cursor-pointer"
                onClick={() => {
                  setSelectedRequestId(record.id);
                  setRejectModalOpen(true);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="pt-3">
      {loading ? (
        <RollerLoading />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          scroll={{ x: 1900, y: 440 }}
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
      <Modal
        title={
          <h3 className="text-[#3bab7b] text-lg mb-2">
            <FormattedMessage id="approveEmployer" />
          </h3>
        }
        open={approveModalOpen}
        confirmLoading={buttonLoadingId === selectedRequestId}
        onCancel={() => setApproveModalOpen(false)}
        onOk={async () => {
          if (!selectedRequestId) return;
          try {
            setButtonLoadingId(selectedRequestId);
            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post(`/back/admin/employers/${selectedRequestId}/approve`, {
              headers: { 'Accept-Language': lang },
            });
            message.success(res.data?.message || intl.formatMessage({ id: 'approveSuccess' }));
            setApproveModalOpen(false);
            fetchRequests();
          } catch (err: any) {
            message.error(err.message || intl.formatMessage({ id: 'approveFailed' }));
          } finally {
            setButtonLoadingId(null);
          }
        }}
      >
        <FormattedMessage id="approveConfirmEmployer" />
      </Modal>
      <Modal
        title={
          <h3 className="text-[#3bab7b] text-lg mb-2">
            <FormattedMessage id="rejectEmployer" />
          </h3>
        }
        open={rejectModalOpen}
        confirmLoading={buttonLoadingId === selectedRequestId}
        onCancel={() => setRejectModalOpen(false)}
        onOk={async () => {
          try {
            if (!selectedRequestId) return;

            // Validate the form
            const values = await rejectForm.validateFields();

            setButtonLoadingId(selectedRequestId);
            const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

            const res = await axios.post(
              `/back/admin/employers/${selectedRequestId}/reject`,
              {
                rejection_reason: values.rejection_reason,
              },
              {
                headers: { 'Accept-Language': lang },
              },
            );

            message.success(res.data?.message || intl.formatMessage({ id: 'rejectSuccess' }));
            setRejectModalOpen(false);
            fetchRequests();
          } catch (err: any) {
            if (err.errorFields) return; // Validation error
            message.error(err.message || intl.formatMessage({ id: 'rejectFailed' }));
          } finally {
            setButtonLoadingId(null);
          }
        }}
      >
        <Form layout="vertical" form={rejectForm}>
          <Form.Item
            name="rejection_reason"
            label={intl.formatMessage({ id: 'rejectionReason' })}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder={intl.formatMessage({ id: 'rejectionReason' })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PendingRequests;

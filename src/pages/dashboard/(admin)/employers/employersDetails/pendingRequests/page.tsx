import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Table, Button, Modal, message, Tooltip, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AiOutlineEye } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";

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
  1: { key: "employer.status.pending", color: "orange" },
  2: { key: "employer.status.active", color: "green" },
  3: { key: "employer.status.inactive", color: "red" },
  5: { key: "employer.status.rejected", color: "red" },
};

function PendingRequests() {
  const [data, setData] = useState<EmployerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [buttonLoadingId, setButtonLoadingId] = useState<number | null>(null);

  const intl = useIntl();
  const [rejectForm] = Form.useForm();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar-sa" : "en-us";

      const res = await axios.get("/back/admin/employers/join-request", {
        headers: { "Accept-Language": lang },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchEmployers" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(true);
      const res = await axios.post(`/back/admin/employers/${id}/approve`);
      message.success(
        res.data?.message || intl.formatMessage({ id: "approveSuccess" }),
      );
      fetchRequests();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "approveFailed" }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoading(true);
      const res = await axios.post(`/back/admin/employers/${id}/reject`);
      message.success(
        res.data?.message || intl.formatMessage({ id: "rejectSuccess" }),
      );
      fetchRequests();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "rejectFailed" }));
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<EmployerRequest> = [
    {
      title: intl.formatMessage({ id: "employerId" }),
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "9%",
    },
    {
      title: intl.formatMessage({ id: "userName" }),
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "user_email",
      key: "user_email",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "phone" }),
      dataIndex: "user_phone",
      key: "user_phone",
      align: "center",
      width: "8%",
    },
    {
      title: intl.formatMessage({ id: "businessName" }),
      dataIndex: "business_name",
      key: "business_name",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "businessType" }),
      dataIndex: "business_type_name",
      key: "business_type_name",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
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
      title: intl.formatMessage({ id: "image" }),
      dataIndex: "image",
      key: "image",
      align: "center",
      width: "10%",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="Employer"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "updatedAt" }),
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "actions" }),
      key: "actions",
      align: "center",
      fixed: "right",
      width: "6%",

      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip
            title={intl.formatMessage({ id: "approveEmployer" })}
            color="#3bab7b"
          >
            <Button
              type="primary"
              size="small"
              className="!rounded-full !w-8 !h-8"
              loading={
                buttonLoadingId === record.id && approveModalOpen === false
                  ? true
                  : false
              }
              onClick={() => {
                setSelectedRequestId(record.id);
                setApproveModalOpen(true);
              }}
            >
              <FiCheck />
            </Button>
          </Tooltip>

          <Tooltip
            title={intl.formatMessage({ id: "rejectEmployer" })}
            color="#d30606ff"
          >
            <Button
              danger
              size="small"
              className="!rounded-full !w-8 !h-8"
              loading={
                buttonLoadingId === record.id && rejectModalOpen === false
                  ? true
                  : false
              }
              onClick={() => {
                setSelectedRequestId(record.id);
                setRejectReason("");
                setRejectModalOpen(true);
              }}
            >
              <FiX />
            </Button>
          </Tooltip>
        </div>
      ),
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
          dataSource={data}
          scroll={{ x: 1600, y: 420 }}
          pagination={{ pageSize: 10 }}
        />
      )}
      <Modal
        title={intl.formatMessage({ id: "approveEmployer" })}
        open={approveModalOpen}
        confirmLoading={buttonLoadingId === selectedRequestId}
        onCancel={() => setApproveModalOpen(false)}
        onOk={async () => {
          if (!selectedRequestId) return;
          try {
            setButtonLoadingId(selectedRequestId);
            const res = await axios.post(
              `/back/admin/employers/${selectedRequestId}/approve`,
            );
            message.success(
              res.data?.message || intl.formatMessage({ id: "approveSuccess" }),
            );
            setApproveModalOpen(false);
            fetchRequests();
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "approveFailed" }),
            );
          } finally {
            setButtonLoadingId(null);
          }
        }}
      />
      <Modal
        title={intl.formatMessage({ id: "rejectEmployer" })}
        open={rejectModalOpen}
        confirmLoading={buttonLoadingId === selectedRequestId}
        onCancel={() => setRejectModalOpen(false)}
        onOk={async () => {
          try {
            if (!selectedRequestId) return;

            // Validate the form
            const values = await rejectForm.validateFields();

            setButtonLoadingId(selectedRequestId);

            const res = await axios.post(
              `/back/admin/employers/${selectedRequestId}/reject`,
              {
                rejection_reason: values.rejection_reason,
              },
            );

            message.success(
              res.data?.message || intl.formatMessage({ id: "rejectSuccess" }),
            );
            setRejectModalOpen(false);
            fetchRequests();
          } catch (err: any) {
            if (err.errorFields) return; // Validation error
            message.error(
              err.message || intl.formatMessage({ id: "rejectFailed" }),
            );
          } finally {
            setButtonLoadingId(null);
          }
        }}
      >
        <Form layout="vertical" form={rejectForm}>
          <Form.Item
            name="rejection_reason"
            label={intl.formatMessage({ id: "rejectionReason" })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: "enterRejectionReason" }),
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={intl.formatMessage({ id: "rejectionReason" })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PendingRequests;

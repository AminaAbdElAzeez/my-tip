import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Table, Modal, Form, message, Tooltip, Select, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FiEdit } from "react-icons/fi";
import { FormattedMessage, useIntl } from "react-intl";
import { Outlet, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";

/* ================= Types ================= */

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact_type: string;
  message: string;
  status: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

/* ================= Component ================= */

function Contacts() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const location = useLocation();
  const intl = useIntl();

  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  /* ================= Status Map ================= */

  const contactStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: "pending" }),
    2: intl.formatMessage({ id: "read" }),
    3: intl.formatMessage({ id: "replied" }),
    4: intl.formatMessage({ id: "closed" }),
  };

  /* ================= Fetch Contacts ================= */

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/back/admin/contacts?page=${pagination.current}&take=${pagination.pageSize}`,
      );

      setData(res.data?.data || []);

      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
      }));

      // message from backend
      if (res.data?.message) {
        message.success(res.data.message);
      }
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "fetchFailed" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [pagination.current, pagination.pageSize]);

  /* ================= Update Status ================= */

  const handleEditStatus = async (values: any) => {
    if (!selectedId) return;

    try {
      setEditLoading(true);

      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("status", values.status);

      if (values.admin_notes) {
        formData.append("admin_notes", values.admin_notes);
      }

      const res = await axios.post(
        `/back/admin/contacts/${selectedId}/status`,
        formData,
      );

      // message from backend
      message.success(res.data?.message);

      setEditOpen(false);
      fetchContacts();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Table Columns ================= */

  const columns: ColumnsType<Contact> = [
    {
      title: intl.formatMessage({ id: "contactId" }),
      dataIndex: "id",
      align: "center",
      width: "6%",
    },
    {
      title: intl.formatMessage({ id: "name" }),
      dataIndex: "name",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "email",
      align: "center",
      width: "14%",
    },
    {
      title: intl.formatMessage({ id: "phone" }),
      dataIndex: "phone",
      align: "center",
      width: "11%",
    },
    {
      title: intl.formatMessage({ id: "contactType" }),
      dataIndex: "contact_type",
      align: "center",
      width: "12%",
    },
    {
      title: intl.formatMessage({ id: "message" }),
      dataIndex: "message",
      align: "center",
      width: "18%",
    },
    {
      title: intl.formatMessage({ id: "status" }),
      dataIndex: "status",
      align: "center",
      width: "8%",
      render: (val) => {
        const color =
          val === 3
            ? "text-green-600"
            : val === 4
              ? "text-red-600"
              : "text-orange-500";

        return <span className={color}>{contactStatusMap[val]}</span>;
      },
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      align: "center",
      width: "10%",
    },
    {
      title: intl.formatMessage({ id: "actions" }),
      align: "center",
      width: "7%",
      fixed: "right",
      render: (_, record) => (
        <Tooltip title={intl.formatMessage({ id: "changeStatus" })}>
          <FiEdit
            className="text-[#3bab7b] text-xl cursor-pointer"
            onClick={() => {
              setSelectedId(record.id);
              editForm.setFieldsValue({
                status: record.status,
                admin_notes: record.admin_notes,
              });
              setEditOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith("/contacts") ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1600, y: 375 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, size) =>
                  setPagination({
                    ...pagination,
                    current: page,
                    pageSize: size!,
                  }),
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Update Status Modal ================= */}

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="updateContactStatus" />
        </h2>

        <Form layout="vertical" form={editForm} onFinish={handleEditStatus}>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: "status" })}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 1, label: intl.formatMessage({ id: "pending" }) },
                { value: 2, label: intl.formatMessage({ id: "read" }) },
                { value: 3, label: intl.formatMessage({ id: "replied" }) },
                { value: 4, label: intl.formatMessage({ id: "closed" }) },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="admin_notes"
            label={intl.formatMessage({ id: "adminNotes" })}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Contacts;

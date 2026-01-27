import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Table, Button, Modal, message, Tooltip, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { FormattedMessage, useIntl } from "react-intl";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RollerLoading from "components/loading/roller";
import { HiOutlineStatusOnline } from "react-icons/hi";

/* ================= Types ================= */
interface User {
  id: string;
  name: string;
  email: string;
  user_type: number;
  status: number;
  created_at: string;
}

/* ================= Component ================= */
function Users() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);

  const [newStatus, setNewStatus] = useState<number>(1);

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalCount: 0,
  });

  /* ================= Fetch Users ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/admin/users?take=${pagination.pageSize}&page=${
          pagination.currentPage + 1
        }`
      );

      setData(res.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: res.data?.count || 0,
      }));
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchUser" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.pageSize]);

  /* ================= Change Status ================= */
  const handleStatusChange = async () => {
    if (!selectedId) return;

    try {
      setStatusLoading(true);

      const formData = new FormData();
      formData.append("_method", "patch");
      formData.append("status", newStatus.toString());

      const res = await axios.post(
        `/admin/users/${selectedId}/change-status`,
        formData
      );

      message.success(
        res.data?.message || intl.formatMessage({ id: "updateSuccess" })
      );

      fetchUsers();
      setStatusModalOpen(false);
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "editFailed" }));
    } finally {
      setStatusLoading(false);
    }
  };

  /* ================= Table Columns ================= */
  const columns: ColumnsType<User> = [
    {
      title: intl.formatMessage({ id: "userId" }),
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "19%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "name" }),
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "19%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "email",
      key: "email",
      align: "center",
      width: "22%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "userType" }),
      dataIndex: "user_type",
      key: "user_type",
      align: "center",
      width: "9%",
      render: (type) =>
        type === 1 ? (
          <span className="text-[#214380] text-[15px]">
            <FormattedMessage id="client" />
          </span>
        ) : (
          <span className="text-[#3bab7b] text-[15px]">
            <FormattedMessage id="artist" />
          </span>
        ),
    },
    {
      title: intl.formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      width: "9%",
      align: "center",
      render: (status) =>
        status === 1 ? (
          <span className="text-green-600 text-[15px]">
            <FormattedMessage id="active" />
          </span>
        ) : (
          <span className="text-red-600 text-[15px]">
            <FormattedMessage id="inactive" />
          </span>
        ),
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      width: "14%",
      align: "center",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "actions" }),
      key: "actions",
      fixed: "right",
      width: "8%",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip
            title={intl.formatMessage({ id: "viewUser" })}
            color="#214380"
          >
            <AiOutlineEye
              className="text-[#214380] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/users/${record.id}`)}
            />
          </Tooltip>

          <Tooltip
            title={intl.formatMessage({ id: "changeStatus" })}
            color="#3bab7b"
          >
            <HiOutlineStatusOnline
              className="text-[#3bab7b] text-2xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                setNewStatus(record.status);
                setStatusModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith("/users") ? (
        <div className="container mx-auto pt-6">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              //   title={() => (
              //     <Tooltip title={intl.formatMessage({ id: 'addUser' })} color="#3bab7b">
              //       <Button type="primary" shape="circle" icon={<FaPlus />} />
              //     </Tooltip>
              //   )}
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1300, y: 430 }}
              pagination={{
                total: pagination.totalCount,
                current: pagination.currentPage + 1,
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                onChange: (page, size) =>
                  setPagination({
                    ...pagination,
                    currentPage: page - 1,
                    pageSize: size,
                  }),
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Status Modal ================= */}
      <Modal
        open={statusModalOpen}
        confirmLoading={statusLoading}
        onCancel={() => setStatusModalOpen(false)}
        onOk={handleStatusChange}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="changeStatus" />
        </h2>

        <Select
          className="w-full mb-2"
          value={newStatus}
          onChange={(val) => setNewStatus(val)}
          options={[
            { value: 1, label: intl.formatMessage({ id: "active" }) },
            { value: 2, label: intl.formatMessage({ id: "inactive" }) },
          ]}
        />
      </Modal>
    </>
  );
}

export default Users;

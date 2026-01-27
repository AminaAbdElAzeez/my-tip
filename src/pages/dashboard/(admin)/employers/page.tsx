import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Table, Button, Modal, Form, message, Tooltip, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { FormattedMessage, useIntl } from "react-intl";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RollerLoading from "components/loading/roller";

/* ================= Types ================= */
interface Employer {
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

function Employers() {
  const [allData, setAllData] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const EMPLOYER_STATUS_KEYS: Record<number, string> = {
    1: "employer.status.pending",
    2: "employer.status.active",
    3: "employer.status.inactive",
    5: "employer.status.rejected",
  };

  /* ================= Fetch Once ================= */
  const fetchEmployers = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar-sa" : "en-us";

      const res = await axios.get(`/back/admin/employers`, {
        headers: { "Accept-Language": lang },
      });

      setAllData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchEmployers" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  /* ================= Client Pagination ================= */

  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = pagination.current * pagination.pageSize;

  const paginatedData = allData.slice(startIndex, endIndex);

  /* ================= Delete ================= */
  const handleDelete = async (id: number) => {
    try {
      setDelLoading(true);
      const res = await axios.delete(`/back/admin/employers/${id}`);
      message.success(
        res.data?.message || intl.formatMessage({ id: "delSuccess" }),
      );
      fetchEmployers();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "delFailed" }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Columns ================= */

  const columns: ColumnsType<Employer> = [
    {
      title: intl.formatMessage({ id: "employerId" }),
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "8%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "userName" }),
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: "10%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "user_email",
      key: "user_email",
      align: "center",
      width: "13%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "phone" }),
      dataIndex: "user_phone",
      key: "user_phone",
      align: "center",
      width: "8%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "businessName" }),
      dataIndex: "business_name",
      key: "business_name",
      align: "center",
      width: "10%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "businessType" }),
      dataIndex: "business_type_name",
      key: "business_type_name",
      align: "center",
      width: "7%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "8%",
      render: (status) => {
        const messageId = EMPLOYER_STATUS_KEYS[status];

        return messageId ? (
          <span>
            <FormattedMessage id={messageId} />
          </span>
        ) : (
          <span className="text-gray-300">
            <FormattedMessage id="noData" />
          </span>
        );
      },
    },

    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "10%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "updatedAt" }),
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
      width: "10%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "image" }),
      dataIndex: "image",
      key: "image",
      width: "10%",
      align: "center",
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="Employer"
            style={{
              width: 100,
              height: 70,
              objectFit: "cover",
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
      title: intl.formatMessage({ id: "actions" }),
      fixed: "right",
      width: "6%",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title={intl.formatMessage({ id: "viewEmployer" })}>
            <AiOutlineEye
              className="text-[#214380] text-2xl cursor-pointer"
              onClick={() => navigate(`/admin/employers/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: "editEmployer" })}>
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              // onClick={() => {
              //   setEditItem(record);
              //   editForm.setFieldsValue(record);
              //   setIsEditModalOpen(true);
              // }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: "deleteEmployer" })}>
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
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

  return (
    <>
      {location.pathname.endsWith("/employers") ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: "addEmployer" })}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    // onClick={() => {
                    //   addForm.resetFields();
                    //   setIsAddModalOpen(true);
                    // }}
                  />
                </Tooltip>
              )}
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              scroll={{ x: 2000, y: 365 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: allData.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "15", "20", "50", "100"],

                onChange: (page, size) => {
                  setPagination({
                    current: page,
                    pageSize: size!,
                  });
                },
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <FormattedMessage id="deleteConfirmEmployer" />
      </Modal>
    </>
  );
}

export default Employers;

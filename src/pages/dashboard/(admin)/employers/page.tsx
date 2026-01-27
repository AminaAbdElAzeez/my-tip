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
  Image,
} from "antd";
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

/* ================= Component ================= */
function Employers() {
  const [data, setData] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Employer | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 15,
    totalCount: 0,
  });

  /* ================= Fetch Employers ================= */
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar-SA" : "en-US";

      const res = await axios.get(
        `/back/admin/employers?page=${pagination.currentPage + 1}`,
        {
          headers: { "Accept-Language": lang },
        }
      );

      setData(res.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: res.data?.pagination?.total || 0,
      }));
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchEmployers" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, [pagination.currentPage, pagination.pageSize]);

  /* ================= Delete ================= */
  const handleDelete = async (id: number) => {
    try {
      setDelLoading(true);
      const res = await axios.delete(`/back/admin/employers/${id}`);
      message.success(
        res.data?.message || intl.formatMessage({ id: "delSuccess" })
      );
      fetchEmployers();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "delFailed" }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Table Columns ================= */
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
      width: "13%",
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
      width: "9%",
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
      render: (text) =>
        text || (
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
      width: "8%",
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
              onClick={() => {
                setEditItem(record);
                editForm.setFieldsValue(record);
                setIsEditModalOpen(true);
              }}
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
        <div className="container mx-auto pt-6">
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
                    onClick={() => {
                      addForm.resetFields();
                      setIsAddModalOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 2000, y: 365 }}
              pagination={{
                total: pagination.totalCount,
                current: pagination.currentPage + 1,
                pageSize: pagination.pageSize,
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

      {/* ================= Delete Modal ================= */}
      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        onCancel={() => setDeleteModalOpen(false)}
        okButtonProps={{ danger: true }}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-[19px] mb-2">
          <FormattedMessage id="deleteEmployer" />
        </h2>
        <h4 className="text-base text-[#333]">
          <FormattedMessage id="deleteConfirmEmployer" />
        </h4>
      </Modal>
    </>
  );
}

export default Employers;

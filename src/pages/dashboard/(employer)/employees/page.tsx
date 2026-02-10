import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import {
  Table,
  Button,
  Modal,
  Form,
  message,
  Tooltip,
  Input,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

/* ================= Types ================= */
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch_id: number;
  branch_name: string;
  position_id: number;
  position_name: string;
  shift_type: number;
  qrcode: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

interface Option {
  id?: number;
  value?: number;
  name: string;
}

/* ================= Component ================= */
function Employees() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [data, setData] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const shiftTypes: Option[] = [
    { value: 1, name: intl.formatMessage({ id: "morning" }) },
    { value: 2, name: intl.formatMessage({ id: "evening" }) },
    { value: 3, name: intl.formatMessage({ id: "full" }) },
  ];

  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /* ================= Fetch ================= */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get("/back/employer/employees", {
        headers: { "Accept-Language": lang },
      });
      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: "fetchFailedEmployees" }));
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    const lang = intl.locale.startsWith("ar") ? "ar" : "en";

    const res = await axios.get("/back/employer/positions", {
      headers: { "Accept-Language": lang },
    });
    setPositions(res.data?.data || []);
  };

  const fetchBranches = async () => {
    const lang = intl.locale.startsWith("ar") ? "ar" : "en";

    const res = await axios.get("/back/employer/branches", {
      headers: { "Accept-Language": lang },
    });
    setBranches(res.data?.data || []);
  };

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
    fetchBranches();
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

  /* ================= Columns ================= */
  const columns: ColumnsType<Employee> = [
    {
      title: intl.formatMessage({ id: "employeeId" }),
      dataIndex: "id",
      key: "id",
      width: "6%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "name" }),
      dataIndex: "name",
      key: "name",
      width: "10%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "email",
      key: "email",
      width: "10%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "phone" }),
      dataIndex: "phone",
      key: "phone",
      width: "6%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "branchId" }),
      dataIndex: "branch_id",
      key: "branch_id",
      width: "5%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "branch" }),
      dataIndex: "branch_name",
      key: "branch_name",
      width: "11%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "position" }),
      dataIndex: "position_name",
      key: "position_name",
      width: "7%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "shiftType" }),
      dataIndex: "shift_type",
      key: "shift_type",
      width: "7%",
      align: "center",
      render: (text) =>
        text ? (
          shiftTypes.find((s) => s.value === text)?.name
        ) : (
          <FormattedMessage id="noData" />
        ),
    },
    {
      title: intl.formatMessage({ id: "qrcode" }),
      dataIndex: "qrcode",
      key: "qrcode",
      width: "8%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "joinedAt" }),
      dataIndex: "joined_at",
      key: "joined_at",
      width: "7%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      width: "9%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "updatedAt" }),
      dataIndex: "updated_at",
      key: "updated_at",
      width: "9%",
      align: "center",
      render: (text) => text || <FormattedMessage id="noData" />,
    },
    {
      title: intl.formatMessage({ id: "actions" }),
      key: "actions",
      align: "center",
      width: "5%",
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip
            title={intl.formatMessage({ id: "viewEmployee" })}
            color="#a86b9e"
          >
            <AiOutlineEye
              className="text-[#a86b9e] text-2xl cursor-pointer"
              onClick={() => navigate(`/employer/employees/${record.id}`)}
            />
          </Tooltip>

          <Tooltip
            title={intl.formatMessage({ id: "editEmployee" })}
            color="#27aa71"
          >
            <FiEdit
              className="text-[#27aa71] text-xl cursor-pointer"
              onClick={() => {
                setSelectedItem(record);
                editForm.setFieldsValue(record);
                setIsEditOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip
            title={intl.formatMessage({ id: "deleteEmployee" })}
            color="#d30606"
          >
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
              onClick={() => {
                setSelectedItem(record);
                setIsDeleteOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  /* ================= JSX ================= */
  return (
    <>
      {location.pathname.endsWith("/employees") ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip title={intl.formatMessage({ id: "addEmployee" })}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    onClick={() => {
                      addForm.resetFields();
                      setIsAddOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              scroll={{ x: 2400, y: 375 }}
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: data.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "15", "20", "50", "100"],
                onChange: (page, size) => {
                  setPagination({ current: page, pageSize: size! });
                },
              }}
              onChange={handleTableChange}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Add Modal ================= */}
      <Modal
        open={isAddOpen}
        confirmLoading={addLoading}
        onCancel={() => setIsAddOpen(false)}
        onOk={async () => {
          try {
            setAddLoading(true);
            const values = await addForm.validateFields();
            const formData = new FormData();
            const lang = intl.locale.startsWith("ar") ? "ar" : "en";

            Object.keys(values).forEach((k) => formData.append(k, values[k]));
            const res = await axios.post("/back/employer/employees", formData, {
              headers: { "Accept-Language": lang },
            });
            message.success(res.data?.message);
            setIsAddOpen(false);
            fetchEmployees();
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "addEmployeeFailed" }),
            );
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-2">
          <FormattedMessage id="addEmployee" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: "name" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "name" })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: "email" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "email" })} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={intl.formatMessage({ id: "phone" })}
            rules={[
              { required: true },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                  if (saudiPhoneRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: "invalidPhone" })),
                  );
                },
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "phone" })} />
          </Form.Item>
          <Form.Item
            name="branch_id"
            label={intl.formatMessage({ id: "branch" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "branch" })}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          </Form.Item>
          <Form.Item
            name="position_id"
            label={intl.formatMessage({ id: "position" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "position" })}
              options={positions.map((p) => ({ value: p.id, label: p.name }))}
            />
          </Form.Item>
          <Form.Item
            name="shift_type"
            label={intl.formatMessage({ id: "shiftType" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "shiftType" })}
              options={shiftTypes.map((s) => ({
                value: s.value!,
                label: s.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}
      <Modal
        open={isEditOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditOpen(false)}
        onOk={async () => {
          try {
            setEditLoading(true);
            const values = await editForm.validateFields();
            const lang = intl.locale.startsWith("ar") ? "ar" : "en";

            const res = await axios.put(
              `/back/employer/employees/${selectedItem?.id}`,
              values,
              {
                headers: { "Accept-Language": lang },
              },
            );
            message.success(res.data?.message);
            setIsEditOpen(false);
            fetchEmployees();
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "editEmployeeFailed" }),
            );
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-2">
          <FormattedMessage id="editEmployee" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: "name" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "name" })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: "email" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "email" })} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={intl.formatMessage({ id: "phone" })}
            rules={[
              { required: true },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                  if (saudiPhoneRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: "invalidPhone" })),
                  );
                },
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: "phone" })} />
          </Form.Item>
          <Form.Item
            name="branch_id"
            label={intl.formatMessage({ id: "branch" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "branch" })}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          </Form.Item>
          <Form.Item
            name="position_id"
            label={intl.formatMessage({ id: "position" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "position" })}
              options={positions.map((p) => ({ value: p.id, label: p.name }))}
            />
          </Form.Item>
          <Form.Item
            name="shift_type"
            label={intl.formatMessage({ id: "shiftType" })}
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "shiftType" })}
              options={shiftTypes.map((s) => ({
                value: s.value!,
                label: s.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}
      <Modal
        open={isDeleteOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setIsDeleteOpen(false)}
        onOk={async () => {
          setDeleteLoading(true);
          const lang = intl.locale.startsWith("ar") ? "ar" : "en";

          const res = await axios.delete(
            `/back/employer/employees/${selectedItem?.id}`,
            {
              headers: { "Accept-Language": lang },
            },
          );
          message.success(res.data?.message);
          setIsDeleteOpen(false);
          fetchEmployees();
          setDeleteLoading(false);
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteEmployee" />
        </h3>
        <FormattedMessage id="deleteConfirmEmployee" />
      </Modal>
    </>
  );
}

export default Employees;

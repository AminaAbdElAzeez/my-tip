import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  message,
  Descriptions,
  Tooltip,
  Form,
  Modal,
  Input,
  Select,
  Button,
} from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

interface EmployeeDetailsType {
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

const SHIFT_MAP: Record<number, string> = {
  1: "morning",
  2: "evening",
  3: "full",
};

function EmployeesDetails() {
  const [employee, setEmployee] = useState<EmployeeDetailsType | null>(null);
  const [loading, setLoading] = useState(false);

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [positions, setPositions] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  const shiftTypes: Option[] = [
    { value: 1, name: intl.formatMessage({ id: "morning" }) },
    { value: 2, name: intl.formatMessage({ id: "evening" }) },
    { value: 3, name: intl.formatMessage({ id: "full" }) },
  ];

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) return <FormattedMessage id="noData" />;
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  /* ================= Fetch ================= */

  const fetchEmployee = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get(`/back/employer/employees/${id}`, {
        headers: { "Accept-Language": lang },
      });

      setEmployee(res.data?.data);
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
    fetchEmployee();
    fetchPositions();
    fetchBranches();
  }, [id, intl.locale]);

  /* ================= Delete ================= */

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.delete(`/back/employer/employees/${id}`, {
        headers: { "Accept-Language": lang },
      });

      message.success(res.data?.message);
      navigate("/employer/employees");
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInvite = async (employeeId: number) => {
    try {
      setInviteLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.post(
        `/back/employer/employees/${employeeId}/invite`,
        {},
        { headers: { "Accept-Language": lang } },
      );

      setInviteData(res.data.data);
      setIsInviteOpen(true);
    } catch (err: any) {
      message.error(err.message || "Failed to create invite");
    } finally {
      setInviteLoading(false);
    }
  };

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!employee)
    return (
      <div className="text-center mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= UI ================= */

  return (
    <section>
      {/* Actions */}
      {/* <div className="flex justify-end gap-3 mb-3">
        <Tooltip title={intl.formatMessage({ id: "editEmployee" })}>
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              editForm.setFieldsValue(employee);
              setIsEditOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip title={intl.formatMessage({ id: "deleteEmployee" })}>
          <FiTrash
            className="text-red-500 text-2xl cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          />
        </Tooltip>
      </div> */}

      <div className="flex justify-end items-center gap-3">
        <Tooltip
          title={intl.formatMessage({ id: "inviteEmployee" })}
          color="#3bab7b"
        >
          <Button
            type="default"
            // size="small"
            className="px-4 py-1"
            onClick={async () => handleInvite(employee.id)}
          >
            <FormattedMessage id="invite" />
          </Button>
        </Tooltip>

        {/* Edit */}
        <Tooltip
          title={intl.formatMessage({ id: "editEmployee" })}
          color="#27aa71"
        >
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              editForm.setFieldsValue(employee);
              setIsEditOpen(true);
            }}
          />
        </Tooltip>

        {/* Delete */}
        <Tooltip
          title={intl.formatMessage({ id: "deleteEmployee" })}
          color="#d30606ff"
        >
          <FiTrash
            className="text-[#d30606ff] text-2xl cursor-pointer"
            onClick={() => {
              setIsDeleteOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip
          title={intl.formatMessage({ id: "addEmployee" })}
          color="#27aa71"
        >
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
      </div>

      {/* Details */}
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item label={intl.formatMessage({ id: "employeeId" })}>
          {displayValue(employee.id)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "name" })}>
          {displayValue(employee.name)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "email" })}>
          {displayValue(employee.email)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "phone" })}>
          {displayValue(employee.phone)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "branchId" })}>
          {displayValue(employee.branch_id)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "branch2" })}>
          {displayValue(employee.branch_name)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "positionId" })}>
          {displayValue(employee.position_id)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "position2" })}>
          {displayValue(employee.position_name)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "shiftType" })}>
          {employee.shift_type ? (
            <FormattedMessage id={SHIFT_MAP[employee.shift_type]} />
          ) : (
            <FormattedMessage id="noData" />
          )}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "qrcode" })}>
          {displayValue(employee.qrcode)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "joinedAt" })}>
          {displayValue(employee.joined_at)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "createdAt" })}>
          {displayValue(employee.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "updatedAt" })}>
          {displayValue(employee.updated_at)}
        </Descriptions.Item>
      </Descriptions>

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
            navigate("/employer/employees");
            fetchEmployee();
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
              `/back/employer/employees/${id}`,
              values,
              {
                headers: { "Accept-Language": lang },
              },
            );
            message.success(res.data?.message);
            setIsEditOpen(false);
            fetchEmployee();
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

          const res = await axios.delete(`/back/employer/employees/${id}`, {
            headers: { "Accept-Language": lang },
          });
          message.success(res.data?.message);
          setIsDeleteOpen(false);
          //   fetchEmployee();
          setDeleteLoading(false);
          navigate("/employer/employees");
        }}
      >
        <h3 className="text-[#3bab7b] text-lg mb-2">
          <FormattedMessage id="deleteEmployee" />
        </h3>
        <FormattedMessage id="deleteConfirmEmployee" />
      </Modal>

      <Modal
        open={isInviteOpen}
        confirmLoading={inviteLoading}
        onCancel={() => setIsInviteOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsInviteOpen(false)}>
            <FormattedMessage id="close" defaultMessage="Close" />
          </Button>,
          <Button
            key="copy"
            type="primary"
            onClick={() => {
              if (inviteData?.invite_code) {
                navigator.clipboard.writeText(inviteData.invite_code);
                message.success(
                  intl.formatMessage({
                    id: "inviteCodeCopied",
                    defaultMessage: "Invite code copied!",
                  }),
                );
              }
            }}
          >
            <FormattedMessage
              id="copyInviteCode"
              defaultMessage="Copy Invite Code"
            />
          </Button>,
        ]}
      >
        <h3 className="text-[#3bab7b] text-xl mb-4">
          <FormattedMessage
            id="inviteEmployee"
            defaultMessage="Invite Employee"
          />
        </h3>

        {inviteData ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={intl.formatMessage({
                id: "employeeId",
                defaultMessage: "employeeId",
              })}
            >
              {inviteData.id}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "employeeName",
                defaultMessage: "Employee Name",
              })}
            >
              {inviteData.employee?.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "qrCode",
                defaultMessage: "QR Code",
              })}
            >
              {inviteData.employee?.qr_code}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "inviteCode",
                defaultMessage: "Invite Code",
              })}
            >
              {inviteData.invite_code}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "expiresAt",
                defaultMessage: "Expires At",
              })}
            >
              {inviteData.expires_at}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "isUsed",
                defaultMessage: "Is Used",
              })}
            >
              <FormattedMessage
                id={inviteData.is_used ? "yes" : "no"}
                defaultMessage={inviteData.is_used ? "Yes" : "No"}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "isExpired",
                defaultMessage: "Is Expired",
              })}
            >
              <FormattedMessage
                id={inviteData.is_expired ? "yes" : "no"}
                defaultMessage={inviteData.is_expired ? "Yes" : "No"}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: "isActive",
                defaultMessage: "Is Active",
              })}
            >
              <FormattedMessage
                id={inviteData.is_active ? "yes" : "no"}
                defaultMessage={inviteData.is_active ? "Yes" : "No"}
              />
            </Descriptions.Item>

            <Descriptions.Item
              label={intl.formatMessage({
                id: "isValid",
                defaultMessage: "is_valid",
              })}
            >
              <FormattedMessage
                id={inviteData.is_valid ? "yes" : "no"}
                defaultMessage={inviteData.is_valid ? "Yes" : "No"}
              />
            </Descriptions.Item>

            <Descriptions.Item
              label={intl.formatMessage({
                id: "createdAt",
                defaultMessage: "created_at",
              })}
            >
              {inviteData.created_at}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>
            <FormattedMessage id="loading" defaultMessage="Loading..." />
          </p>
        )}
      </Modal>
    </section>
  );
}

export default EmployeesDetails;

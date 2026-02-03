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
  Button,
  Select,
  Image,
  Tag,
} from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";

interface Employer {
  id: string;
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

function EmployersDetails() {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editForm] = Form.useForm();

  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) {
      return (
        <p className="text-gray-300">
          <FormattedMessage id="noData" />
        </p>
      );
    }
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  const EMPLOYER_STATUS_MAP: Record<number, { key: string; color: string }> = {
    1: { key: "employer.status.pending", color: "orange" },
    2: { key: "employer.status.active", color: "green" },
    3: { key: "employer.status.inactive", color: "red" },
    5: { key: "employer.status.rejected", color: "volcano" },
  };

  const renderStatus = (status: number) => {
    const statusData = EMPLOYER_STATUS_MAP[status];

    if (!statusData) {
      return (
        <Tag className="py-1 px-2">
          <FormattedMessage id="noData" />
        </Tag>
      );
    }

    return (
      <Tag color={statusData.color} className="py-1 px-2">
        <FormattedMessage id={statusData.key} />
      </Tag>
    );
  };

  /* ================= Fetch Employer ================= */

  useEffect(() => {
    fetchEmployer();
  }, [id]);

  const fetchEmployer = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get(`/back/admin/employers/${id}`, {
        headers: { "Accept-Language": lang },
      });

      setEmployer(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: "fetchFailed" }));
    } finally {
      setLoading(false);
    }
  };

  /* ================= Delete ================= */

  const handleDelete = async (id: string) => {
    try {
      setDelLoading(true);

      const res = await axios.delete(`/admin/employers/${id}`);

      message.success(
        res.data?.message || intl.formatMessage({ id: "delSuccess" }),
      );

      navigate("/admin/employers");
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "delFailed" }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!employer)
    return (
      <div className="text-center text-gray-500 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= UI ================= */

  return (
    <section>
      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        {/* Delete */}
        <Tooltip
          title={intl.formatMessage({ id: "deleteEmployer" })}
          color="#d30606ff"
        >
          <FiTrash
            className="text-[#d30606ff] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(employer.id);
              setDeleteModalOpen(true);
            }}
          />
        </Tooltip>

        {/* Edit */}
        <Tooltip
          title={intl.formatMessage({ id: "editEmployer" })}
          color="#3bab7b"
        >
          <FiEdit
            className="text-[#3bab7b] text-2xl cursor-pointer"
            onClick={() => {
              editForm.setFieldsValue({
                user_name: employer.user_name,
                user_email: employer.user_email,
                user_phone: employer.user_phone,
                business_name: employer.business_name,
                status: employer.status,
              });
              setIsEditModalOpen(true);
            }}
          />
        </Tooltip>
      </div>

      {/* Details */}
      <Descriptions bordered column={1} className="mt-8">
        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "employerId" })}
            </b>
          }
        >
          {displayValue(employer.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "userName" })}
            </b>
          }
        >
          {displayValue(employer.user_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "email" })}
            </b>
          }
        >
          {displayValue(employer.user_email)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "phone" })}
            </b>
          }
        >
          {displayValue(employer.user_phone)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "businessName" })}
            </b>
          }
        >
          {displayValue(employer.business_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "businessType" })}
            </b>
          }
        >
          {displayValue(employer.business_type_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "status" })}
            </b>
          }
        >
          {renderStatus(employer.status)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {" "}
              {intl.formatMessage({ id: "image" })}
            </b>
          }
        >
          {employer.image ? (
            <Image
              src={employer.image}
              alt="Employer"
              style={{
                width: 130,
                height: 130,
                // objectFit: "cover",
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
            displayValue(null)
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "createdAt" })}
            </b>
          }
        >
          {displayValue(employer.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              {intl.formatMessage({ id: "updatedAt" })}
            </b>
          }
        >
          {displayValue(employer.updated_at)}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= Edit Modal ================= */}

      <Modal
        open={isEditModalOpen}
        confirmLoading={editLoading}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={async () => {
          try {
            setEditLoading(true);

            const values = await editForm.validateFields();

            const formData = new FormData();
            formData.append("_method", "put");
            formData.append("user_name", values.user_name);
            formData.append("user_email", values.user_email);
            formData.append("user_phone", values.user_phone);
            formData.append("business_name", values.business_name);
            formData.append("status", values.status);

            const res = await axios.post(
              `/admin/employers/${employer.id}`,
              formData,
            );

            message.success(
              res.data?.message || intl.formatMessage({ id: "updateSuccess" }),
            );

            setIsEditModalOpen(false);
            fetchEmployer();
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "editFailed" }),
            );
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="editEmployer" />
        </h2>

        <Form layout="vertical" form={editForm}>
          <Form.Item name="user_name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="user_email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="user_phone"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="business_name"
            label="Business Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 1, label: "Pending" },
                { value: 2, label: "Active" },
                { value: 3, label: "Blocked" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}

      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        okButtonProps={{ danger: true }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          if (selectedId) handleDelete(selectedId);
          setDeleteModalOpen(false);
        }}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-2">
          <FormattedMessage id="deleteEmployer" />
        </h2>

        <p>
          <FormattedMessage id="deleteConfirmEmployer" />
        </p>
      </Modal>
    </section>
  );
}

export default EmployersDetails;

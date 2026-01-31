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
  Upload,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { UploadOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { Outlet, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";

/* ================= Types ================= */

interface Bank {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

/* ================= Component ================= */

function Withdrawals() {
  const [data, setData] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Bank | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const location = useLocation();
  const intl = useIntl();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  /* ================= Fetch Banks ================= */

  const fetchBanks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/back/admin/banks?page=${pagination.current}&take=${pagination.pageSize}`,
      );

      setData(res.data?.data || []);

      const pg = res.data?.pagination;

      setPagination((prev) => ({
        ...prev,
        total: pg?.total || 0,
      }));
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "fetchFailed" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [pagination.current, pagination.pageSize]);

  /* ================= Add ================= */

  const handleAdd = async (values: any) => {
    try {
      setAddLoading(true);

      const formData = new FormData();
      formData.append("name_ar", values.name_ar);
      formData.append("name_en", values.name_en);

      if (values.logo?.[0]) {
        formData.append("logo", values.logo[0].originFileObj);
      }

      const res = await axios.post(`/back/admin/banks`, formData);

      message.success(res.data?.message);

      setAddOpen(false);
      fetchBanks();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  /* ================= Edit ================= */

  const handleEdit = async (values: any) => {
    if (!selectedId) return;

    try {
      setEditLoading(true);

      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("name_ar", values.name_ar);
      formData.append("name_en", values.name_en);

      if (values.logo && values.logo[0] && values.logo[0].originFileObj) {
        formData.append("logo", values.logo[0].originFileObj);
      }

      const res = await axios.post(`/back/admin/banks/${selectedId}`, formData);

      message.success(res.data?.message);

      setEditOpen(false);
      fetchBanks();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDelLoading(true);

      const res = await axios.delete(`/back/admin/banks/${selectedId}`);

      message.success(res.data?.message);

      setDeleteOpen(false);
      fetchBanks();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Upload Helper ================= */

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  /* ================= Table Columns ================= */

  const columns: ColumnsType<Bank> = [
    {
      title: intl.formatMessage({ id: "bankId" }),
      dataIndex: "id",
      key: "id",
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
      title: intl.formatMessage({ id: "nameAr" }),
      dataIndex: "name_ar",
      key: "name_ar",
      align: "center",
      width: "20%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "nameEn" }),
      dataIndex: "name_en",
      key: "name_en",
      align: "center",
      width: "20%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "logo" }),
      dataIndex: "logo",
      align: "center",
      width: "15%",
      render: (img) =>
        img ? (
          <Image
            src={img}
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
          <span className="text-gray-400">
            <FormattedMessage id="noImage" />
          </span>
        ),
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "15%",
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
      width: "15%",
      render: (text) =>
        text || (
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
        <div className="flex justify-center gap-3">
          <Tooltip title={intl.formatMessage({ id: "edit" })}>
            <FiEdit
              className="text-[#3bab7b] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                const fileList = record.logo
                  ? [
                      {
                        uid: "-1",
                        name: record.name_en,
                        status: "done",
                        url: record.logo,
                      },
                    ]
                  : [];

                editForm.setFieldsValue({
                  ...record,
                  logo: fileList,
                });

                setEditOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: "delete" })}>
            <FiTrash
              className="text-[#d30606] text-xl cursor-pointer"
              onClick={() => {
                setSelectedId(record.id);
                setDeleteOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {location.pathname.endsWith("/banks") ? (
        <div className="pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip
                  title={intl.formatMessage({ id: "addBank" })}
                  color="#3bab7b"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FaPlus />}
                    onClick={() => {
                      addForm.resetFields();
                      setAddOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              columns={columns}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 1400, y: 375 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, size) => {
                  setPagination({
                    current: page,
                    pageSize: size!,
                    total: pagination.total,
                  });
                },
              }}
            />
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* ================= Add Modal ================= */}

      <Modal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        confirmLoading={addLoading}
        onOk={() => addForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="addBank" />
        </h2>

        <Form layout="vertical" form={addForm} onFinish={handleAdd}>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: "nameAr" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "nameAr" })} />
          </Form.Item>

          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: "nameEn" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "nameEn" })} />
          </Form.Item>

          <Form.Item
            name="logo"
            label={intl.formatMessage({ id: "logo" })}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>
                <FormattedMessage id="uploadLogo" />
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Edit Modal ================= */}

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="editBank" />
        </h2>

        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: "nameAr" })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: "nameEn" })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="logo"
            label={intl.formatMessage({ id: "logo" })}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>
                <FormattedMessage id="uploadLogo" />
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}

      <Modal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        confirmLoading={delLoading}
        onOk={handleDelete}
        okButtonProps={{ danger: true }}
      >
        <h2 className="text-[#d30606] font-semibold text-lg mb-2">
          <FormattedMessage id="deleteBank" />
        </h2>
        <p>
          <FormattedMessage id="deleteConfirmBank" />
        </p>
      </Modal>
    </>
  );
}

export default Withdrawals;

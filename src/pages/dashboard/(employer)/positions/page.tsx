import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Table, Button, Modal, Form, message, Tooltip, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { Outlet, useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";

/* ================= Types ================= */
interface Position {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  tip_percentage: string;
  created_at: string;
  updated_at: string;
}

function Positions() {
  const intl = useIntl();

  const [data, setData] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Position | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  /* ================= Fetch ================= */
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get("/back/employer/positions", {
        headers: { "Accept-Language": lang },
      });

      setData(res.data?.data || []);
    } catch {
      message.error(intl.formatMessage({ id: "fetchFailedPosition" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
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
  const columns: ColumnsType<Position> = [
    {
      title: intl.formatMessage({ id: "positionId" }),
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "6%",
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
      width: "10%",
      render: (text) =>
        text || (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: intl.formatMessage({ id: "description" }),
      dataIndex: "description",
      key: "description",
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
      title: intl.formatMessage({ id: "positionNameEn" }),
      dataIndex: "name_en",
      key: "name_en",
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
      title: intl.formatMessage({ id: "positionNameAr" }),
      dataIndex: "name_ar",
      key: "name_ar",
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
      title: intl.formatMessage({ id: "positionDescEn" }),
      dataIndex: "description_en",
      key: "description_en",
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
      title: intl.formatMessage({ id: "positionDescAr" }),
      dataIndex: "description_ar",
      key: "description_ar",
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
      title: intl.formatMessage({ id: "tipPercentage" }),
      dataIndex: "tip_percentage",
      key: "tip_percentage",
      align: "center",
      width: "7%",
      render: (text) => (text ? `${text}%` : <FormattedMessage id="noData" />),
    },
    {
      title: intl.formatMessage({ id: "createdAt" }),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "11%",
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
      width: "11%",
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
      align: "center",
      width: "5%",
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip
            title={intl.formatMessage({ id: "viewPosition" })}
            color="#a86b9e"
          >
            <AiOutlineEye
              className="text-[#a86b9e] text-2xl cursor-pointer"
              onClick={() => navigate(`/employer/positions/${record.id}`)}
            />
          </Tooltip>
          <Tooltip
            title={intl.formatMessage({ id: "editPosition" })}
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
            title={intl.formatMessage({ id: "deletePosition" })}
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
      {location.pathname.endsWith("/positions") ? (
        <div className=" pt-3">
          {loading ? (
            <RollerLoading />
          ) : (
            <Table
              title={() => (
                <Tooltip
                  title={intl.formatMessage({ id: "addPosition" })}
                  color="#2ab479"
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
              )}
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              scroll={{ x: 2200, y: 375 }}
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
            Object.keys(values).forEach((key) =>
              formData.append(key, values[key]),
            );

            const res = await axios.post("/back/employer/positions", formData);

            message.success(res.data?.message);
            setIsAddOpen(false);
            fetchPositions();
          } catch (err: any) {
            message.error(
              err.message || intl.formatMessage({ id: "addPositionFailed" }),
            );
          } finally {
            setAddLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-2">
          <FormattedMessage id="addPosition" />
        </h3>

        <Form layout="vertical" form={addForm}>
          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: "positionNameEn" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionNameEn" })} />
          </Form.Item>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: "positionNameAr" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionNameAr" })} />
          </Form.Item>
          <Form.Item
            name="description_en"
            label={intl.formatMessage({ id: "positionDescEn" })}
            rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({ id: "positionDescEn" })}
            />
          </Form.Item>
          <Form.Item
            name="description_ar"
            label={intl.formatMessage({ id: "positionDescAr" })}
            rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({ id: "positionDescAr" })}
            />
          </Form.Item>
          <Form.Item
            name="tip_percentage"
            label={intl.formatMessage({ id: "tipPercentage" })}
            rules={[{ required: true }]}
          >
            <Input
              min={0}
              max={100}
              placeholder={intl.formatMessage({ id: "tipPercentage" })}
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

            const formData = new FormData();
            formData.append("_method", "put");
            Object.keys(values).forEach((key) =>
              formData.append(key, values[key]),
            );

            const res = await axios.post(
              `/back/employer/positions/${selectedItem?.id}`,
              formData,
            );

            message.success(res.data?.message);
            setIsEditOpen(false);
            fetchPositions();
          } catch (err: any) {
            message.error(err.message);
          } finally {
            setEditLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-2">
          <FormattedMessage id="editPosition" />
        </h3>

        <Form layout="vertical" form={editForm}>
          <Form.Item
            name="name_en"
            label={intl.formatMessage({ id: "positionNameEn" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionNameEn" })} />
          </Form.Item>
          <Form.Item
            name="name_ar"
            label={intl.formatMessage({ id: "positionNameAr" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionNameAr" })} />
          </Form.Item>
          <Form.Item
            name="description_en"
            label={intl.formatMessage({ id: "positionDescEn" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionDescEn" })} />
          </Form.Item>
          <Form.Item
            name="description_ar"
            label={intl.formatMessage({ id: "positionDescAr" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "positionDescAr" })} />
          </Form.Item>
          <Form.Item
            name="tip_percentage"
            label={intl.formatMessage({ id: "tipPercentage" })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: "tipPercentage" })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}
      <Modal
        open={isDeleteOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setIsDeleteOpen(false)}
        onOk={async () => {
          try {
            setDeleteLoading(true);
            const res = await axios.delete(
              `/back/employer/positions/${selectedItem?.id}`,
            );
            message.success(res.data?.message);
            setIsDeleteOpen(false);
            fetchPositions();
          } catch (err: any) {
            message.error(err.message);
          } finally {
            setDeleteLoading(false);
          }
        }}
      >
        <h3 className="text-[#3bab7b] text-xl mb-2">
          <FormattedMessage id="deletePosition" />
        </h3>
        <FormattedMessage id="deleteConfirmPosition" />{" "}
      </Modal>
    </>
  );
}

export default Positions;

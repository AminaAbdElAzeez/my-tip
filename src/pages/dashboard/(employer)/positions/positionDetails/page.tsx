import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "utlis/library/helpers/axios";
import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Tag,
  Tooltip,
} from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FaPlus } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Position {
  id: number;
  name: string;
  description: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  tip_percentage: string;
  created_at: string;
  updated_at: string;
}

function PositionDetails() {
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

  const { id } = useParams();
  const intl = useIntl();

  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);

  const displayValue = (value: any) =>
    value ? (
      <span className="text-[#3bab7b]">{value}</span>
    ) : (
      <span className="text-gray-300">
        <FormattedMessage id="noData" />
      </span>
    );

  const fetchPosition = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith("ar") ? "ar" : "en";

      const res = await axios.get(`/back/employer/positions/${id}`, {
        headers: { "Accept-Language": lang },
      });

      setPosition(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: "fetchFailedPosition" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, [id, intl.locale]);

  if (loading) return <RollerLoading />;
  if (!position)
    return (
      <div className="text-center mt-10 text-gray-400">
        <FormattedMessage id="noData" />
      </div>
    );

  return (
    <section>
      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        <Tooltip
          title={intl.formatMessage({ id: "editPosition" })}
          color="#27aa71"
        >
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedItem(position);
              editForm.setFieldsValue({
                name_en: position.name_en,
                name_ar: position.name_ar,
                description_en: position.description_en,
                description_ar: position.description_ar,
                tip_percentage: position.tip_percentage,
              });
              setIsEditOpen(true);
            }}
          />
        </Tooltip>

        <Tooltip
          title={intl.formatMessage({ id: "deletePosition" })}
          color="#d30606"
        >
          <FiTrash
            className="text-[#d30606] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedItem(position);
              setIsDeleteOpen(true);
            }}
          />
        </Tooltip>

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
      </div>
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item label={intl.formatMessage({ id: "positionId" })}>
          {displayValue(position.id)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "name" })}>
          {displayValue(position.name)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "description" })}>
          {displayValue(position.description)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "positionNameEn" })}>
          {displayValue(position.name_en)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "positionNameAr" })}>
          {displayValue(position.name_ar)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "positionDescEn" })}>
          {displayValue(position.description_en)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "positionDescAr" })}>
          {displayValue(position.description_ar)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "tipPercentage" })}>
          {position.tip_percentage ? (
            <Tag color="green" className="px-2 py-1">
              {position.tip_percentage}%
            </Tag>
          ) : (
            <FormattedMessage id="noData" />
          )}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "createdAt" })}>
          {displayValue(position.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={intl.formatMessage({ id: "updatedAt" })}>
          {displayValue(position.updated_at)}
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
            Object.keys(values).forEach((key) =>
              formData.append(key, values[key]),
            );

            const res = await axios.post("/back/employer/positions", formData);

            message.success(res.data?.message);
            setIsAddOpen(false);
            navigate("/employer/positions");
            // fetchPosition();
          } catch (err: any) {
            message.error(err.message);
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
            fetchPosition();
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
            navigate("/employer/positions");

            // fetchPosition();
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
    </section>
  );
}

export default PositionDetails;

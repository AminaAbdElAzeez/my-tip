import { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  message,
  Descriptions,
  Tooltip,
  Form,
  Modal,
  Select,
  Input,
  Button,
} from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { FaPlus } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";

interface City {
  id: string;
  name_en: string;
  name_ar: string;
  governorate_id: string;
  governorate_name: string;
  created_at: string;
}

interface Governorate {
  id: string;
  name_en: string;
  name_ar: string;
}

function UserDetails() {
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<City | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [data, setData] = useState<City[]>([]);
  const [delLoading, setDelLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCity();
    fetchGovernorates();
  }, [id]);

  const fetchCity = async () => {
    setLoading(true);
    try {
      const lang = intl.locale.startsWith("ar") ? "ar-SA" : "en-US";

      const res = await axios.get(`/admin/cities/${id}`, {
        headers: { "Accept-Language": lang },
      });

      setCity(res?.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: "failedToFetchUsers" }));
    } finally {
      setLoading(false);
    }
  };

  /* ================= Fetch Governorates ================= */
  const fetchGovernorates = async () => {
    try {
      const res = await axios.get("/admin/governorates");
      setGovernorates(res.data?.data || []);
    } catch {}
  };

  /* ================= Delete ================= */
  const handleDelete = async (id: string) => {
    try {
      setDelLoading(true);
      const res = await axios.delete(`/admin/cities/${id}`);
      message.success(
        res.data?.message || intl.formatMessage({ id: "delSuccess" })
      );
      navigate("/admin/cities");
      //   fetchCity();
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: "delFailed" }));
    } finally {
      setDelLoading(false);
    }
  };

  if (loading) return <RollerLoading />;

  if (!city)
    return (
      <div className="text-center text-gray-500 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  return (
    <section>
      <div className="flex justify-end items-center gap-2">
        {/* Delete */}
        <Tooltip
          title={intl.formatMessage({ id: "deleteCity" })}
          color="#d30606ff"
        >
          <FiTrash
            className="text-[#d30606ff] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(city.id);
              setDeleteModalOpen(true);
            }}
          />
        </Tooltip>

        {/* Edit */}
        <Tooltip title={intl.formatMessage({ id: "editCity" })} color="#3bab7b">
          <FiEdit
            className="text-[#3bab7b] text-2xl cursor-pointer"
            onClick={() => {
              setEditItem(city);
              editForm.setFieldsValue({
                name_en: city.name_en,
                name_ar: city.name_ar,
                governorate_id: city.governorate_id,
              });
              setIsEditModalOpen(true);
            }}
          />
        </Tooltip>

        {/* Add New */}
        <Tooltip title={intl.formatMessage({ id: "addCity" })} color="#3bab7b">
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
      </div>

      <Descriptions column={1} bordered className="mt-8">
        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="cityId" />
            </b>
          }
        >
          {displayValue(city.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="nameEn" />
            </b>
          }
        >
          {displayValue(city.name_en)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="nameAr" />
            </b>
          }
        >
          {displayValue(city.name_ar)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="governorate" />
            </b>
          }
        >
          {displayValue(city.governorate_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="createdAt" />
            </b>
          }
        >
          {displayValue(city.created_at)}
        </Descriptions.Item>
      </Descriptions>
    </section>
  );
}

export default UserDetails;

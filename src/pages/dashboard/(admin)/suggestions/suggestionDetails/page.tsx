import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Descriptions, Tooltip, Modal, Button, Tag, Image, Form, Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';

interface Suggestion {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  suggestion_type: string;
  description: string;
  status: number;
  attachment: string;
  created_at: string;
  updated_at: string;
}

function SuggestionDetails() {
  const [data, setData] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const [editForm] = Form.useForm();

  const suggestionStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'pending' }),
    2: intl.formatMessage({ id: 'reviewed' }),
    3: intl.formatMessage({ id: 'implemented' }),
    4: intl.formatMessage({ id: 'rejected' }),
  };

  /* ================= Helpers ================= */

  const displayValue = (value: any) => {
    if (!value) {
      return (
        <span className="text-gray-300">
          <FormattedMessage id="noData" />
        </span>
      );
    }
    return <span className="text-[#3bab7b]">{value}</span>;
  };

  /* ================= Fetch ================= */

  const fetchSuggestion = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(`/back/admin/suggestions/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setData(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: 'fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, [id]);

  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchSuggestion();
  }, [id,intl.locale]);

  /* ================= Update Status ================= */

  const handleEditStatus = async (values: any) => {
    if (!selectedId) return;

    try {
      setEditLoading(true);

      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('status', values.status);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.post(`/back/admin/suggestions/${selectedId}/status`, formData, {
        headers: { 'Accept-Language': lang },
      });

      message.success(res.data?.message);

      setEditOpen(false);
      fetchSuggestion();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!data)
    return (
      <div className="text-center text-gray-400 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  return (
    <section className="pt-3">
      {/* ================= Actions ================= */}
      <div className="flex justify-end items-center gap-3">
        {/* Edit */}
        <Tooltip title={intl.formatMessage({ id: 'changeStatus' })} color="#27aa71">
          <FiEdit
            className="text-[#27aa71] text-2xl cursor-pointer"
            onClick={() => {
              setSelectedId(data.id);
              editForm.setFieldsValue({ status: data.status });
              setEditOpen(true);
            }}
          />
        </Tooltip>
      </div>

      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="suggestionsId" />
            </b>
          }
        >
          {displayValue(data.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="userId" />
            </b>
          }
        >
          {displayValue(data.user?.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="userName" />
            </b>
          }
        >
          {displayValue(data.user?.name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="email" />
            </b>
          }
        >
          {displayValue(data.user?.email)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="suggestionType" />
            </b>
          }
        >
          {displayValue(data.suggestion_type)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="description" />
            </b>
          }
        >
          {displayValue(data.description)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="status" />
            </b>
          }
        >
          <Tag color="#3bab7b" className="px-2 py-1">
            {suggestionStatusMap[data.status]}
          </Tag>{' '}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="attachment" />
            </b>
          }
        >
          {data.attachment ? (
            <Image
              src={data.attachment}
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
            <FormattedMessage id="noImage" />
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="createdAt" />
            </b>
          }
        >
          {displayValue(data.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="updatedAt" />
            </b>
          }
        >
          {displayValue(data.updated_at)}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= Update Status Modal ================= */}

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="updateSuggestionStatus" />
        </h2>

        <Form layout="vertical" form={editForm} onFinish={handleEditStatus}>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'status' })}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 1, label: intl.formatMessage({ id: 'pending' }) },
                { value: 2, label: intl.formatMessage({ id: 'reviewed' }) },
                { value: 3, label: intl.formatMessage({ id: 'implemented' }) },
                { value: 4, label: intl.formatMessage({ id: 'rejected' }) },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default SuggestionDetails;

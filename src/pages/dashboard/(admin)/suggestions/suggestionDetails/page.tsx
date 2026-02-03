import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Descriptions, Tooltip, Modal, Button, Tag, Image } from 'antd';
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

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

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

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleteLoading(true);

      const res = await axios.delete(`/back/admin/suggestions/${id}`);

      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));

      navigate('/admin/suggestions');
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDeleteLoading(false);
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

      <Descriptions bordered column={1}>
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

      {/* ================= Delete Modal ================= */}

      <Modal
        open={deleteOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setDeleteOpen(false)}
        okButtonProps={{ danger: true }}
        onOk={handleDelete}
      >
        <h2 className="text-[#d30606] font-semibold text-lg mb-2">
          <FormattedMessage id="deleteSuggestion" />
        </h2>

        <p>
          <FormattedMessage id="deleteConfirmSuggestion" />
        </p>
      </Modal>
    </section>
  );
}

export default SuggestionDetails;

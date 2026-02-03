import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Descriptions, Tooltip, Modal, Button, Tag, Avatar, Image } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';

interface SocialMedia {
  social_media_id: number;
  social_media_name: string;
  social_media_image: string;
  url: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  type: number;
  status: number;
  is_active: boolean;
  is_phone_verified: boolean;
  active_notification: boolean;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  employee_position: string | null;
  socialMedia: SocialMedia[];
}

function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  /* ================= Status Map ================= */

  // ================= Maps for localization =================
  const userStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'statusPending' }),
    2: intl.formatMessage({ id: 'statusActive' }),
    3: intl.formatMessage({ id: 'statusInactive' }),
    5: intl.formatMessage({ id: 'statusIncompleted' }),
    6: intl.formatMessage({ id: 'statusReject' }),
  };

  const userTypeMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'typeAdmin' }),
    2: intl.formatMessage({ id: 'typeEmployer' }),
    3: intl.formatMessage({ id: 'typeEmployee' }),
    4: intl.formatMessage({ id: 'typeCreator' }),
    5: intl.formatMessage({ id: 'typeCustomer' }),
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
    return <span className="text-[#3bab7b] font-medium">{value}</span>;
  };

  /* ================= Fetch User ================= */

  const fetchUser = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(`/back/admin/users/${id}`, {
        headers: { 'Accept-Language': lang },
      });

      setUser(res.data?.data);
    } catch {
      message.error(intl.formatMessage({ id: 'failedToFetchUsers' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDelLoading(true);
      const res = await axios.delete(`/admin/users/${id}`);

      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));

      navigate('/admin/users');
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'delFailed' }));
    } finally {
      setDelLoading(false);
    }
  };

  /* ================= Loading ================= */

  if (loading) return <RollerLoading />;

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-10">
        <FormattedMessage id="noData" />
      </div>
    );

  /* ================= UI ================= */

  return (
    <section className="pt-3">
      {/* ===== Header Actions ===== */}

      {/* ===== Details ===== */}

      <Descriptions bordered column={1}>
        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="userId" />
            </b>
          }
        >
          {displayValue(user.id)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="name" />
            </b>
          }
        >
          {displayValue(user.name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="email" />
            </b>
          }
        >
          {displayValue(user.email)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">
              <FormattedMessage id="phone" />
            </b>
          }
        >
          {displayValue(user.phone)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]"> {intl.formatMessage({ id: 'image' })}</b>}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt="User"
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
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'type' })}</b>}
        >
          {displayValue(userTypeMap[user.type]) || displayValue(null)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'status' })}</b>}
        >
          {displayValue(userStatusMap[user.status]) || displayValue(null)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'isActive' })}</b>}
        >
          <Tag className="px-2 py-1" color="#3bab7b">
            {user.is_active ? intl.formatMessage({ id: 'yes' }) : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'phoneVerified' })}</b>}
        >
          <Tag color="#3bab7b" className="px-2 py-1">
            {user.is_phone_verified
              ? intl.formatMessage({ id: 'yes' })
              : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <b className="text-[#3bab7b]">{intl.formatMessage({ id: 'activeNotification' })}</b>
          }
        >
          <Tag color="#3bab7b" className="px-2 py-1">
            {user.active_notification
              ? intl.formatMessage({ id: 'yes' })
              : intl.formatMessage({ id: 'no' })}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'businessName' })}</b>}
        >
          {displayValue(user.business_name)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'employeePosition' })}</b>}
        >
          {displayValue(user.employee_position)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}
        >
          {displayValue(user.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}
        >
          {displayValue(user.updated_at)}
        </Descriptions.Item>

        {/* ===== Social Media ===== */}
        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'createdAt' })}</b>}
        >
          {displayValue(user.created_at)}
        </Descriptions.Item>
        <Descriptions.Item
          label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'updatedAt' })}</b>}
        >
          {displayValue(user.updated_at)}
        </Descriptions.Item>

        {/* ===== Social Media ===== */}
        {user.socialMedia?.length > 0 && (
          <Descriptions.Item
            label={<b className="text-[#3bab7b]">{intl.formatMessage({ id: 'socialMedia' })}</b>}
          >
            <div className="flex flex-wrap gap-2">
              {user.socialMedia.map((item) => (
                <a key={item.social_media_id} href={item.url} target="_blank" rel="noreferrer">
                  <Tag color="blue" className="flex items-center gap-1 cursor-pointer px-2 py-1">
                    {item.social_media_image && (
                      <Avatar size="small" src={item.social_media_image} />
                    )}
                    {item.social_media_name}
                  </Tag>
                </a>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* ===== Delete Modal ===== */}

      <Modal
        open={deleteModalOpen}
        confirmLoading={delLoading}
        okButtonProps={{ danger: true }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
      >
        <h3 className="text-[#3bab7b] font-semibold mb-2">
          <FormattedMessage id="deleteUser" />
        </h3>
        <p>
          <FormattedMessage id="deleteConfirmUser" />
        </p>
      </Modal>
    </section>
  );
}

export default UserDetails;

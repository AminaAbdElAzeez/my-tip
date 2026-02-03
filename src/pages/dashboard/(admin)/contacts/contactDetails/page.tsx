import { useEffect, useState } from 'react';
import axios from 'utlis/library/helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Descriptions, Tooltip, Modal, Button, Tag, Form, Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import RollerLoading from 'components/loading/roller';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';

/* ================= Types ================= */

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact_type: string;
  message: string;
  status: number;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

/* ================= Component ================= */

function ContactDetails() {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [editForm] = Form.useForm();

  /* ================= Status Map ================= */

  const contactStatusMap: Record<number, string> = {
    1: intl.formatMessage({ id: 'pending' }),
    2: intl.formatMessage({ id: 'read' }),
    3: intl.formatMessage({ id: 'replied' }),
    4: intl.formatMessage({ id: 'closed' }),
  };

  const statusColors: Record<number, string> = {
    1: 'gold',
    2: 'blue',
    3: 'green',
    4: 'red',
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

  /* ================= Fetch Contact ================= */

  const fetchContact = async () => {
    try {
      setLoading(true);

      const lang = intl.locale.startsWith('ar') ? 'ar-SA' : 'en-US';

      const res = await axios.get(`/back/admin/contacts/${id}`, {
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
    fetchContact();
  }, [id]);

  /* ================= Update Status ================= */

  const handleUpdateStatus = async (values: any) => {
    if (!id) return;

    try {
      setEditLoading(true);

      const formData = new FormData();
      formData.append('_method', 'put');
      formData.append('status', String(values.status));

      const res = await axios.post(`/back/admin/contacts/${id}/status`, formData);

      message.success(res.data?.message);

      editForm.resetFields();
      setEditOpen(false);
      fetchContact();
    } catch (err: any) {
      message.error(err.response?.data?.message || intl.formatMessage({ id: 'editFailed' }));
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleteLoading(true);

      const res = await axios.delete(`/back/admin/contacts/${id}`);

      message.success(res.data?.message || intl.formatMessage({ id: 'delSuccess' }));

      navigate('/admin/contacts');
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
    <section className='pt-3'>
      {/* ================= Actions ================= */}

      

      {/* ================= Details ================= */}

      <Descriptions bordered column={1}>
        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="contactId" /></b>}>
          {displayValue(data.id)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="name" /></b>}>
          {displayValue(data.name)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="email" /></b>}>
          {displayValue(data.email)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="phone" /></b>}>
          {displayValue(data.phone)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="contactType" /></b>}>
          {displayValue(data.contact_type)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="message" /></b>}>
          {displayValue(data.message)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="adminNotes" /></b>}>
          {displayValue(data.admin_notes)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="status" /></b>}>
          <Tag color={statusColors[data.status]} className='py-1 px-2'>
            {contactStatusMap[data.status]}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="createdAt" /></b>}>
          {displayValue(data.created_at)}
        </Descriptions.Item>

        <Descriptions.Item label={<b className="text-[#3bab7b]"><FormattedMessage id="updatedAt" /></b>}>
          {displayValue(data.updated_at)}
        </Descriptions.Item>
      </Descriptions>

      {/* ================= Update Status Modal ================= */}

      <Modal
        open={editOpen}
        confirmLoading={editLoading}
        onCancel={() => setEditOpen(false)}
        onOk={() => editForm.submit()}
      >
        <h2 className="text-[#3bab7b] font-semibold text-lg mb-3">
          <FormattedMessage id="updateContactStatus" />
        </h2>

        <Form layout="vertical" form={editForm} onFinish={handleUpdateStatus}>
          <Form.Item
            name="status"
            label={<FormattedMessage id="status" />}
            rules={[{ required: true }]}
          >
            <Select>
              {[1, 2, 3, 4].map((item) => (
                <Select.Option key={item} value={item}>
                  {contactStatusMap[item]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= Delete Modal ================= */}

      <Modal
        open={deleteOpen}
        confirmLoading={deleteLoading}
        onCancel={() => setDeleteOpen(false)}
        okButtonProps={{ danger: true }}
        onOk={handleDelete}
      >
        <h2 className="text-[#d30606] font-semibold text-lg mb-2">
          <FormattedMessage id="deleteContact" />
        </h2>

        <p>
          <FormattedMessage id="deleteConfirmContact" />
        </p>
      </Modal>
    </section>
  );
}

export default ContactDetails;

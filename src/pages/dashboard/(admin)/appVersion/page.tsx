import { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, message, Card } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';
import axios from 'utlis/library/helpers/axios';
import RollerLoading from 'components/loading/roller';

const AppVersion = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // ================== Get Version Data ==================
  const getVersion = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/back/admin/app-version');

      if (res.data?.status) {
        const data = res.data.data;

        form.setFieldsValue({
          android_version: data.android_version,
          ios_version: data.ios_version,
          is_forced: data.is_forced,
          message: data.message,
        });
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'somethingWentWrong' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVersion();
  }, []);

  // ================== Update Version ==================
  const onFinish = async (values: any) => {
    try {
      setBtnLoading(true);

      const formData = new FormData();

      formData.append('_method', 'put');
      formData.append('android_version', values.android_version);
      formData.append('ios_version', values.ios_version);
      formData.append('is_forced', values.is_forced ? '1' : '0');
      formData.append('message', values.message);

      const res = await axios.post('/back/admin/app-version', formData);

      if (res.data?.status) {
        message.success(res.data.message);
        getVersion();
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'updateFailed' }));
    } finally {
      setBtnLoading(false);
    }
  };

  // ================== UI ==================
  return (
    <>
      {loading ? (
        <RollerLoading />
      ) : (
        <Card
          title={
            <h3 className="text-[#3bab7b] text-lg mb-2">
              <FormattedMessage id="appVersionSettings" />
            </h3>
          }
          bordered={false}
          className="m-2 !mt-5 p-2"
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Android Version */}
            <Form.Item
              label={<FormattedMessage id="androidVersion" />}
              name="android_version"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'requiredField',
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* IOS Version */}
            <Form.Item
              label={<FormattedMessage id="iosVersion" />}
              name="ios_version"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'requiredField',
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Force Update */}
            <Form.Item
              label={<FormattedMessage id="forceUpdate" />}
              name="is_forced"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {/* Message */}
            <Form.Item label={<FormattedMessage id="versionMessage" />} name="message">
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={btnLoading}>
                <FormattedMessage id="saveChanges" />
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </>
  );
};

export default AppVersion;

import { useEffect, useState } from 'react';
import { Form, Button, message, Card, Row, Col, Input } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';
import axios from 'utlis/library/helpers/axios';
import RollerLoading from 'components/loading/roller';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/* ================= Component ================= */

const Settings = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  /* ================= Fetch Settings ================= */

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const lang = intl.locale.startsWith('ar') ? 'ar' : 'en';

      const res = await axios.get('/back/admin/settings', {
        headers: { 'Accept-Language': lang },
      });

      if (res.data?.status) {
        const data = res.data.data;

        form.setFieldsValue({
          terms_ar: data.terms_ar,
          terms_en: data.terms_en,
          privacy_policy_ar: data.privacy_policy_ar,
          privacy_policy_en: data.privacy_policy_en,
          about_us_ar: data.about_us_ar,
          about_us_en: data.about_us_en,
          system_fee: data.system_fee,
          employer_fee: data.employer_fee,
          minimum_withdrawal_amount: data.minimum_withdrawal_amount,
        });
      }
    } catch (err) {
      message.error(intl.formatMessage({ id: 'somethingWentWrong' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);
  /* ================= Fetch Once / On Locale or Pagination ================= */
  useEffect(() => {
    fetchSettings();
  }, [intl.locale]);

  /* ================= Update Settings ================= */

  const onFinish = async (values: any) => {
    try {
      setBtnLoading(true);

      const formData = new FormData();

      formData.append('_method', 'put');
      formData.append('terms_ar', values.terms_ar || '');
      formData.append('terms_en', values.terms_en || '');
      formData.append('privacy_policy_ar', values.privacy_policy_ar || '');
      formData.append('privacy_policy_en', values.privacy_policy_en || '');
      formData.append('about_us_ar', values.about_us_ar || '');
      formData.append('about_us_en', values.about_us_en || '');
      formData.append('system_fee', values.system_fee || '');
      formData.append('employer_fee', values.employer_fee || '');
      formData.append('minimum_withdrawal_amount', values.minimum_withdrawal_amount || '');

      const res = await axios.post('/back/admin/settings', formData);

      if (res.data?.status) {
        message.success(res.data.message);
        fetchSettings();
      }
    } catch (err: any) {
      message.error(err.message || intl.formatMessage({ id: 'updateFailed' }));
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= React Quill Modules ================= */

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  /* ================= UI ================= */

  return (
    <>
      {loading ? (
        <RollerLoading />
      ) : (
        <Card
          title={
            <h3 className="text-[#3bab7b] text-lg mb-2 font-semibold">
              <FormattedMessage id="systemSettings" />
            </h3>
          }
          bordered={false}
          className="m-3"
          bodyStyle={{
            padding: 30,
            backgroundColor: '#fdfdfd',
            borderRadius: 12, // حواف Card
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 1100, margin: '0 auto' }}
          >
            <Row gutter={[20, 20]}>
              {/* Terms */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="termsAr" />
                    </span>
                  }
                  name="terms_ar"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'termsAr' })}
                    style={{ borderRadius: 8 }} // حواف الـ Quill
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="termsEn" />
                    </span>
                  }
                  name="terms_en"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'termsEn' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* Privacy Policy */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="privacyPolicyAr" />
                    </span>
                  }
                  name="privacy_policy_ar"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'privacyPolicyAr' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="privacyPolicyEn" />
                    </span>
                  }
                  name="privacy_policy_en"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'privacyPolicyEn' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* About Us */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="aboutUsAr" />
                    </span>
                  }
                  name="about_us_ar"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'aboutUsAr' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="aboutUsEn" />
                    </span>
                  }
                  name="about_us_en"
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={intl.formatMessage({ id: 'aboutUsEn' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* Fees */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="systemFee" />
                    </span>
                  }
                  name="system_fee"
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'systemFee' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="employerFee" />
                    </span>
                  }
                  name="employer_fee"
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'employerFee' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={
                    <span className="text-[#3bab7b] font-medium text-base">
                      <FormattedMessage id="minimumWithdrawal" />
                    </span>
                  }
                  name="minimum_withdrawal_amount"
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'minimumWithdrawal' })}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit */}
            <Form.Item style={{ marginTop: 30, textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={btnLoading}
                size="large"
                style={{
                  padding: '0 40px',
                  backgroundColor: '#3bab7b',
                  borderColor: '#3bab7b',
                  borderRadius: 8, // حواف الـ Button
                  fontWeight: 600,
                }}
              >
                <FormattedMessage id="saveChanges" />
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </>
  );
};

export default Settings;

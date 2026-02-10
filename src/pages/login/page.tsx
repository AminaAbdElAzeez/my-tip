import {
  Button,
  Form,
  Input,
  Checkbox,
  Layout,
  theme,
  Dropdown,
  Space,
  MenuProps,
  message,
  Card,
  Modal,
} from 'antd';
import { useState } from 'react';
import LangSwitcher from 'containers/layout/Topbar/LangSwitcher';
import ThemesSwitcher from 'containers/layout/Topbar/ThemesSwitcher';
import authAction from 'store/auth/actions';
import { useDispatch } from 'react-redux';
import middleware from 'utlis/navigation/mw';
import { useSelector } from 'react-redux';
import { LoggedUserCanNotOpen } from 'middlewares';
import axios from 'utlis/library/helpers/axios';
import { toast } from 'react-hot-toast';
import { FormattedMessage, useIntl } from 'react-intl';
import { Typography } from 'antd';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { permissionsTransform } from 'utlis/library/helpers/permissions';
import { useForm } from 'antd/lib/form/Form';
import SmallLogo from 'components/LogoWraper/small-logo';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { PhoneNumberUtil } from 'google-libphonenumber';
import profileActions from 'store/profile/actions';

const { Title } = Typography;

const { login } = authAction;
const { fetchProfileDataSuccess } = profileActions;
const phoneUtil = PhoneNumberUtil.getInstance();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language,
  );

  const [otpVisible, setOtpVisible] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState<'login' | 'forget_password'>('login');
  const [resetVisible, setResetVisible] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const openOTPModal = (phone: string) => {
    setOtpPhone(phone);
    setOtpCode('');
    setOtpVisible(true);
  };

  // verify OTP
  const verifyMutation = useMutation({
    mutationFn: () =>
      axios.post(
        'back/auth/verify',
        {
          phone: otpPhone,
          code: otpCode,
          type: otpType,
        },
        {
          headers: {
            'Accept-Language': locale === 'en' ? 'en' : 'ar',
          },
        },
      ),
    onSuccess: (res: any) => {
      message.success(res.data.message);
      setOtpVisible(false);

      if (otpType === 'login') {
        mutation.mutate({
          login: otpPhone,
          password: form.getFieldValue('password'),
        });
      }

      if (otpType === 'forget_password') {
        setResetVisible(true);
      }
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.message || intl.formatMessage({ id: 'otp.verify.failed' }));
    },
  });

  // resend OTP
  const resendOtp = async () => {
    setOtpCode('');
    try {
      const res = await axios.post(
        'back/auth/send-code',
        {
          phone: otpPhone,
          type: otpType,
        },
        {
          headers: {
            'Accept-Language': locale === 'en' ? 'en' : 'ar',
          },
        },
      );
      toast.success(res.data.message);
    } catch (err: any) {
      message.error(err.response?.data?.message || intl.formatMessage({ id: 'otp.resend.failed' }));
    }
  };

  const handleLoginOtp = (phone: string) => {
    setOtpType('login');
    openOTPModal(phone);
  };

  const handleForgetPassword = async () => {
    const phone = form.getFieldValue('login');

    if (!phone) {
      message.error(intl.formatMessage({ id: 'forget.enter.phone' }));
      return;
    }

    try {
      const res = await axios.post(
        'back/auth/send-code',
        {
          phone,
          type: 'forget_password',
        },
        {
          headers: {
            'Accept-Language': locale === 'en' ? 'en' : 'ar',
          },
        },
      );

      toast.success(res.data.message);
      openOTPModal(phone);
      setOtpType('forget_password');
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  //   const onFinish = (values: any) => {
  //   setLoading(true);
  //   const myPromise = axios["post"]("/login", values);

  //   // toast.promise(
  //   //   myPromise,
  //   //   {
  //   //     loading: (
  //   //       <div className="min-w-[200px]">
  //   //         {locale === "ar" ? "جاري المعالجة " : "Pending"}
  //   //       </div>
  //   //     ),
  //   //     success: (res) => {
  //   //       setLoading(false);

  //   //       return "Backend Message Error Occured";
  //   //     },
  //   //     error: (err) => {
  //   //       setLoading(false);
  //   //       return err.response?.data?.message || "Backend Error Occured";
  //   //     },
  //   //   },
  //   //   {
  //   //     style: {
  //   //       minWidth: "250px",
  //   //     },
  //   //     success: {
  //   //       duration: 3000,
  //   //       icon: "🔥",
  //   //     },
  //   //   }
  //   // );
  // };

  const [form] = useForm();

  const mutation = useMutation({
    mutationFn: (values: any) =>
      axios.post('back/auth/login', values, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale === 'en' ? 'en' : 'ar',
        },
      }),
    onSuccess: (res: any) => {
      const token = res.data.token;
      const type = res.data.data.type;
      console.log('LOGIN RESPONSE:', res.data);
      console.log('USER TYPE:', res.data.data.type);

      message.success(res.data.message);
      // console.log(token);
      // localStorage.setItem("token", token);
      console.log(type);
      dispatch(login(token, type));

      // dispatch(login(res.data.token, user.type));
      dispatch(fetchProfileDataSuccess(type));

      // dispatch(login(res.data.token));

      let redirectPath = '/';
      if (type === 1) {
        redirectPath = '/admin/statistics';
      } else {
        redirectPath = '/employer/statistics';
      }

      navigate(redirectPath);
    },
    onError: async (err: any) => {
      const responseData = err.response.data;
      const status = responseData?.status; // true / false
      const messageText = err.response.data.message;
      if (
        status === false &&
        (messageText.includes('Invalid email or password.') ||
          messageText.includes('البريد الإلكتروني أو كلمة المرور غير صحيحة.'))
      ) {
        message.error(intl.formatMessage({ id: 'login.invalid' }));
      } else if (
        status === false &&
        (messageText.includes('Your account is not active. Please contact support.') ||
          messageText.includes('حسابك غير نشط. يرجى التواصل مع الدعم.'))
      ) {
        message.error(intl.formatMessage({ id: 'login.not.active' }));
      } else if (
        status === false &&
        (messageText.includes('Phone number not verified. Please verify your phone.') ||
          messageText.includes('رقم الجوال غير موثق. يرجى التحقق من رقم جوالك.'))
      ) {
        message.error(intl.formatMessage({ id: 'login.phone.not.verified' }));
        const phoneFromForm = form.getFieldValue('login');
        handleLoginOtp(phoneFromForm);

        openOTPModal(phoneFromForm);
      } else {
        message.error(messageText);
      }
    },
  });
  const onFinish = (values: any) => {
    mutation.mutate(values);
    //handleSubmit(values);
  };

  const handleResetPassword = async (values: any) => {
    setResetLoading(true);
    try {
      const res = await axios.post(
        'back/auth/forget-password',
        {
          phone: otpPhone,
          code: otpCode,
          password: values.password,
          password_confirmation: values.password_confirmation,
        },
        {
          headers: {
            'Accept-Language': locale === 'en' ? 'en' : 'ar',
          },
        },
      );

      message.success(res.data.message);
      setResetVisible(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || intl.formatMessage({ id: 'reset.failed' }));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-texture-light dark:bg-texture-dark">
      <div className="box-border absolute inset-x-0 top-0 w-full flex items-center justify-between container mx-auto py-5 px-2">
        <div className=" flex items-center text-[#3bab7b] no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
          <Link to={'/'}>
            <img
              // className="w-20 h-auto"
              className="w-20 h-20!"
              src="/logo.svg"
              width={52}
              height={73}
              alt="outlet plus-admin"
            />
          </Link>{' '}
        </div>
        <ul className="flex gap-3 items-center">
          <li className="isoUser flex">
            <LangSwitcher />
          </li>
          <li className="isoUser">
            <ThemesSwitcher />
          </li>
        </ul>
      </div>

      <div className="min-h-[100dvh] box-border w-full flex flex-col items-center justify-center px-3 sm:px-6 py-8 mx-auto lg:py-0">
        <motion.div
          initial={{ y: -150, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="w-full max-w-md"
        >
          <Card className=" w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="space-y-4 sm:p-4 sm:pb-0">
              <Title className="!text-xl font-bold leading-tight tracking-tight   md:!text-2xl ">
                <FormattedMessage id="signin.signToYourAccount" />
              </Title>
              <Form
                layout="vertical"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label={<FormattedMessage id="email-phone" />}
                  name="login"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="email-phone-required" />,
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const saudiPhoneRegex = /^(5\d{8}|9665\d{8})$/;
                        if (emailRegex.test(value) || saudiPhoneRegex.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(intl.formatMessage({ id: 'invalid-email-phone' })),
                        );
                      },
                    },
                  ]}
                >
                  <Input size="large" placeholder={intl.formatMessage({ id: 'email-phone' })} />
                </Form.Item>

                <Form.Item
                  label={<FormattedMessage id="password" />}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="password-required" />,
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder={intl.formatMessage({ id: 'password' })}
                  />
                </Form.Item>
                <div className="flex justify-between mb-5">
                  {/* <Form.Item
                    className="mb-0"
                    name="remember"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      <FormattedMessage id="page.signInRememberMe" />
                    </Checkbox>
                  </Form.Item> */}
                  {/* <Dropdown menu={{ items, onClick }}>
                    <a className="py-[5px]" onClick={(e) => e.preventDefault()}>
                      <Space>
                        <FormattedMessage id="page.forgetPassSubTitle" />
                      </Space>
                    </a>
                  </Dropdown> */}
                  {/* <Link to="/signup"><FormattedMessage id="register-new-account" /></Link> */}
                </div>

                <Button
                  type="link"
                  onClick={() => handleForgetPassword()}
                  className="text-base font-medium flex justify-end items-center text-center w-full -mt-6 mb-4 text-[#3bab7b] hover:!text-[#3bab7b] hover:underline underline-offset-4 transition-all duration-500 !px-0"
                >
                  <FormattedMessage id="forget.password" />
                </Button>

                <Form.Item>
                  <Button
                    // type="primary"

                    size="large"
                    className="w-full text-white bg-[#3bab7b] hover:bg-[#3bab7b]"
                    htmlType="submit"
                    loading={mutation.isPending}
                  >
                    <FormattedMessage id="page.signInButton" />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </motion.div>
      </div>
      <Modal
        // title="Verify Phone"
        destroyOnClose
        open={otpVisible}
        onCancel={() => {
          setOtpVisible(false);
          setOtpCode('');
        }}
        footer={null}
        closable={false}
      >
        <h3 className="text-[#B172A7] text-[22px] mb-1">
          <FormattedMessage id="otp.verify.title" />
        </h3>
        <h5 className="text-[#3bab7b] text-lg mb-4">
          <FormattedMessage id="otp.code.title" />
        </h5>
        <Form
          layout="vertical"
          onFinish={() => {
            if (otpCode.length !== 4) {
              message.error(intl.formatMessage({ id: 'otp.full.required' }));
              return;
            }

            verifyMutation.mutate();
          }}
        >
          <div className="flex justify-center items-center">
            <Form.Item
              // label="OTP Code"
              name="otp"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'otp.required' }),
                },
              ]}
            >
              <Input.OTP
                length={4}
                value={otpCode}
                onChange={(value) => {
                  setOtpCode(value);

                  if (value.length === 4) {
                    verifyMutation.mutate();
                  }
                }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              // type="primary"
              size="large"
              htmlType="submit"
              loading={verifyMutation.isPending}
              className="w-full text-white bg-[#3bab7b] hover:bg-[#3bab7b] mt-2"
            >
              <FormattedMessage id="otp.verify.button" />
            </Button>
          </Form.Item>
          <Button
            type="link"
            onClick={resendOtp}
            className="text-base font-medium flex justify-center items-center text-center w-full -mt-3 text-[#3bab7b] hover:!text-[#3bab7b] hover:underline underline-offset-4 transition-all duration-500"
          >
            <FormattedMessage id="otp.resend" />
          </Button>
        </Form>
      </Modal>

      <Modal
        open={resetVisible}
        destroyOnClose
        footer={null}
        onCancel={() => setResetVisible(false)}
      >
        <h3 className="text-[#3bab7b] text-xl mb-4">
          <FormattedMessage id="reset.password.title" />
        </h3>

        <Form layout="vertical" onFinish={handleResetPassword} className="flex flex-col gap-0.5">
          <Form.Item
            name="password"
            label={<FormattedMessage id="reset.password.new.label" />}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'reset.password.new.required',
                }),
              },
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({
                id: 'reset.password.new.placeholder',
              })}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label={<FormattedMessage id="reset.password.confirm.label" />}
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'reset.password.confirm.required',
                }),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(intl.formatMessage({ id: 'reset.password.not.match' }));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({
                id: 'reset.password.confirm.placeholder',
              })}
              size="large"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            size="large"
            className="w-full bg-[#3bab7b] text-white mb-2 mt-3 "
            loading={resetLoading}
          >
            <FormattedMessage id="reset.password.button" />
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default middleware(Login, [LoggedUserCanNotOpen]);

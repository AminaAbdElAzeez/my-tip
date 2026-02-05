import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Form,
  Input,
  Button,
  Upload,
  Switch,
  Tabs,
  Image,
  Dropdown,
  Menu,
  Space,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import toast from "react-hot-toast";
import axios from "utlis/library/helpers/axios";
import authAction from "store/auth/actions";
import { FormattedMessage, useIntl } from "react-intl";
import RollerLoading from "components/loading/roller";
import { AiOutlineEye } from "react-icons/ai";
import { IoCameraSharp } from "react-icons/io5";
import { DownOutlined } from "@ant-design/icons";

const { logout } = authAction;

const Profile = () => {
  const dispatch = useDispatch();
  const [profileForm] = useForm();
  const [passwordForm] = useForm();
  const intl = useIntl();
  const { Option } = Select;
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("1");

  /* ================= GET PROFILE ================= */
  const fetchProfile = async () => {
    const { data } = await axios.get("back/auth/profile");
    profileForm.setFieldsValue({
      name: data.data.name,
      email: data.data.email,
      active_notification: data.data.active_notification,
    });
    return data.data;
  };

  const {
    data: profile,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  /* ================= UPDATE NAME & EMAIL ================= */
  const updateProfile = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("name", values.name);
      formData.append("email", values.email);
      return axios.post("back/auth/profile", formData);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      dispatch(logout());
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Error");
    },
  });

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = useMutation({
    mutationFn: (values: any) =>
      axios.post("back/auth/change-password", values),
    onSuccess: (res) => {
      toast.success(res.data.message);
      passwordForm.resetFields();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Error");
    },
  });

  /* ================= PROFILE IMAGE ================= */
  const uploadImage = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("profile_image", file);
      return axios.post("back/auth/profile-image", formData);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      refetch();
    },
  });

  useEffect(() => {
    if (profile?.lang) {
      setLang(profile.lang);
    }
  }, [profile]);

  /* ================= NOTIFICATION ================= */
  const toggleNotification = useMutation({
    mutationFn: (value: number) => {
      const formData = new FormData();
      formData.append("active_notification", String(value));
      return axios.post("back/auth/active-notification", formData);
    },
    onSuccess: (res) => toast.success(res.data.message),
  });

  /* ================= LANGUAGE ================= */
  const changeLang = useMutation({
    mutationFn: (lang: string) => {
      const formData = new FormData();
      formData.append("lang", lang);
      return axios.post("auth/lang", formData);
    },
    onSuccess: (res) => toast.success(res.data.message),
  });

  if (isLoading) return <RollerLoading />;

  return (
    <div className="container mx-auto p-4 rounded-md">
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        {/* ================= BASIC INFO ================= */}
        <Tabs.TabPane tab={intl.formatMessage({ id: "profileInfo" })} key="1">
          {
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={(values) => updateProfile.mutate(values)}
              className="w-full py-3 px-2 sm:w-[50%] md:w-[40%]"
            >
              <Form.Item
                name="name"
                label={<FormattedMessage id="name" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: "nameReq" }),
                  },
                ]}
              >
                <Input
                  name="name"
                  size="large"
                  placeholder={intl.formatMessage({ id: "name" })}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<FormattedMessage id="email" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: "emailReq" }),
                  },
                  {
                    type: "email",
                    message: <FormattedMessage id="invalid-email" />,
                  },
                ]}
              >
                <Input
                  name="email"
                  size="large"
                  placeholder={intl.formatMessage({ id: "email" })}
                />
              </Form.Item>

              <Button
                loading={updateProfile.isPending}
                size="large"
                className="w-full text-white min-w-[60px] md:min-w-[80px] mt-4 bg-[#3bab7b] hover:bg-[#3bab7b] inline-block"
                htmlType="submit"
              >
                <FormattedMessage id="edit-profile" />
              </Button>
            </Form>
          }
        </Tabs.TabPane>

        {/* ================= PASSWORD ================= */}
        <Tabs.TabPane
          tab={intl.formatMessage({ id: "changePassword" })}
          key="2"
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={(values) => changePassword.mutate(values)}
            className="w-full py-3 px-2 sm:w-[50%] md:w-[40%]"
          >
            <Form.Item
              name="current_password"
              label={intl.formatMessage({ id: "currentPassword" })}
              rules={[{ required: true }]}
            >
              <Input.Password
                size="large"
                placeholder={intl.formatMessage({ id: "currentPassword" })}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={intl.formatMessage({ id: "newPassword" })}
              rules={[{ required: true }]}
            >
              <Input.Password
                size="large"
                placeholder={intl.formatMessage({ id: "newPassword" })}
              />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label={intl.formatMessage({ id: "confirmPassword" })}
              dependencies={["password"]}
              rules={[{ required: true }]}
            >
              <Input.Password
                size="large"
                placeholder={intl.formatMessage({ id: "confirmPassword" })}
              />
            </Form.Item>

            <Button
              htmlType="submit"
              size="large"
              loading={changePassword.isPending}
              className="w-full text-white min-w-[60px] md:min-w-[80px] mt-4 bg-[#3bab7b] hover:bg-[#3bab7b] inline-block"
            >
              {intl.formatMessage({ id: "changePassword" })}
            </Button>
          </Form>
        </Tabs.TabPane>

        {/* ================= IMAGE ================= */}
        <Tabs.TabPane
          tab={intl.formatMessage({ id: "upload-image" })}
          key="3"
          className="flex flex-col gap-4"
        >
          <div className="w-[200px]">
            {profile?.image && (
              <Image
                src={profile.image}
                alt="profile"
                style={{ width: 200, height: "auto", borderRadius: 8 }}
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
            )}
          </div>

          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              uploadImage.mutate(file);
              return false;
            }}
          >
            <Button
              loading={uploadImage.isPending}
              className="w-full text-[#2ab479] text-base !px-5 !py-4 flex items-center justify-center gap-2"
            >
              <IoCameraSharp className="text-2xl" />
              {intl.formatMessage({ id: "upload-image" })}
            </Button>
          </Upload>
        </Tabs.TabPane>

        {/* ================= SETTINGS ================= */}
        <Tabs.TabPane tab={intl.formatMessage({ id: "settings" })} key="4">
          <div className="flex gap-2 mb-4 sm:w-[50%] md:w-[40%] items-center">
            <h3 className="text-[#3bab7b] text-lg mb-0 font-semibold">
              {intl.formatMessage({ id: "notification" })}:
            </h3>
            <Switch
              className="mt-0"
              defaultChecked={profile?.active_notification}
              onChange={(checked) => toggleNotification.mutate(checked ? 1 : 0)}
              loading={toggleNotification.isPending}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <h3 className="text-[#3bab7b] text-lg mb-0 font-semibold">
              {intl.formatMessage({ id: "lang" })}:
            </h3>
            <div className="w-[150px]">
              <Select
                value={lang}
                onChange={(value) => {
                  setLang(value);
                  changeLang.mutate(value);
                }}
                loading={changeLang.isPending}
                className="w-full"
              >
                <Option value="ar">
                  {intl.formatMessage({ id: "arabic" })}
                </Option>
                <Option value="en">
                  {intl.formatMessage({ id: "english" })}
                </Option>
              </Select>
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;

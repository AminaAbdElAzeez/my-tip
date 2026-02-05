// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import authAction from "store/auth/actions";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axios from "utlis/library/helpers/axios";
// import { Button, Form, Input, notification } from "antd";
// import { useForm } from "antd/lib/form/Form";
// import { useNavigate } from "react-router-dom";
// import { FormattedMessage } from "react-intl";
// import RollerLoading from "components/loading/roller";

// const { logout } = authAction;
// const Profile = () => {
//   const dispatch = useDispatch();
//   const [form] = useForm();

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const fetchProfileData = async () => {
//     const { data } = await axios.get(`back/auth/profile`);
//     const profile = data?.data;

//     form.setFieldsValue({
//       name: profile?.name,
//       email: profile?.email,
//     });

//     return data;
//   };
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["fetchProfile"],
//     queryFn: fetchProfileData,
//     // refetchInterval: 5000,
//   });

//   /////// edit profile mutation
//   const editProfileMutation = useMutation({
//     mutationFn: (values) => axios["put"](`back/auth/profile`, values),
//     onSuccess: (res) => {
//       const { message } = res?.data;
//       // form.resetFields();

//       toast.success(message, {
//         position: "top-center",
//         duration: 3000,
//       });
//       dispatch(logout());
//     },
//     onError: (err) => {
//       const {
//         status,
//         data: { message },
//       } = (err as any).response;
//       console.log(err, err.message);

//       toast.error(err.message, {
//         position: "top-center",
//         duration: 3000,
//       });
//     },
//   });

//   const editProfileFinish = (values: any) => {
//     editProfileMutation.mutate(values);
//   };

//   return (
//     <div className="container mx-auto px-4 rounded-md">
//       {/* {profile.loading ? (
//         <RollerLoading />
//       ) : ( */}

//       <Form
//         layout="vertical"
//         onFinish={editProfileFinish}
//         form={form}
//         className="w-full py-10 px-2 sm:w-[50%] md:w-[40%]"
//       >
//         <Form.Item
//           label={<FormattedMessage id="name" />}
//           name="name"
//           rules={[{ required: true, message: <FormattedMessage id="name" /> }]}
//         >
//           <Input name="name" size="large" />
//         </Form.Item>

//         <Form.Item
//           label={<FormattedMessage id="email" />}
//           name="email"
//           rules={[
//             {
//               required: true,
//               message: <FormattedMessage id="email" />,
//             },
//             {
//               type: "email",
//               message: <FormattedMessage id="invalid-email" />,
//             },
//           ]}
//         >
//           <Input name="email" size="large" />
//         </Form.Item>

//         <Form.Item
//           label={<FormattedMessage id="password" />}
//           name="password"
//           rules={[
//             {
//               required: true,
//               message: <FormattedMessage id="password-required" />,
//             },
//           ]}
//         >
//           <Input.Password name="password" size="large" />
//         </Form.Item>

//         <Button
//           // type="primary"

//           size="large"
//           className="w-full text-white min-w-[60px] md:min-w-[80px] mt-10 bg-[#3bab7b] hover:bg-[#3bab7b] inline-block"
//           htmlType="submit"
//           loading={editProfileMutation.isPending}
//         >
//           <FormattedMessage id="edit-profile" />
//         </Button>
//       </Form>

//       {/* )} */}
//     </div>
//   );
// };

// export default Profile;

// // ========================================================================================

// import React from "react";
// import { useDispatch } from "react-redux";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Form, Input, Button, Upload, Switch, Tabs } from "antd";
// import { useForm } from "antd/lib/form/Form";
// import toast from "react-hot-toast";
// import axios from "utlis/library/helpers/axios";
// import authAction from "store/auth/actions";
// import { FormattedMessage, useIntl } from "react-intl";
// import RollerLoading from "components/loading/roller";

// const { logout } = authAction;

// const Profile = () => {
//   const dispatch = useDispatch();
//   const [profileForm] = useForm();
//   const [passwordForm] = useForm();
//   const intl = useIntl();

//   /* ================= GET PROFILE ================= */
//   const fetchProfile = async () => {
//     const { data } = await axios.get("back/auth/profile");
//     profileForm.setFieldsValue({
//       name: data.data.name,
//       email: data.data.email,
//       active_notification: data.data.active_notification,
//     });
//     return data.data;
//   };

//   const {
//     data: profile,
//     refetch,
//     isLoading,
//   } = useQuery({
//     queryKey: ["profile"],
//     queryFn: fetchProfile,
//   });

//   /* ================= UPDATE NAME & EMAIL ================= */
//   const updateProfile = useMutation({
//     mutationFn: (values: any) => {
//       const formData = new FormData();
//       formData.append("_method", "put");
//       formData.append("name", values.name);
//       formData.append("email", values.email);

//       return axios.post("back/auth/profile", formData);
//     },
//     onSuccess: (res) => {
//       toast.success(res.data.message);
//       dispatch(logout());
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || "Error");
//     },
//   });

//   /* ================= CHANGE PASSWORD ================= */
//   const changePassword = useMutation({
//     mutationFn: (values: any) =>
//       axios.post("back/auth/change-password", values),
//     onSuccess: (res) => {
//       toast.success(res.data.message);
//       passwordForm.resetFields();
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || "Error");
//     },
//   });

//   /* ================= PROFILE IMAGE ================= */
//   const uploadImage = useMutation({
//     mutationFn: (file: File) => {
//       const formData = new FormData();
//       formData.append("profile_image", file);
//       return axios.post("back/auth/profile-image", formData);
//     },
//     onSuccess: (res) => {
//       toast.success(res.data.message);
//       refetch();
//     },
//   });

//   /* ================= NOTIFICATION ================= */
//   const toggleNotification = useMutation({
//     mutationFn: (value: number) => {
//       const formData = new FormData();
//       formData.append("active_notification", String(value));
//       return axios.post("back/auth/active-notification", formData);
//     },
//     onSuccess: (res) => toast.success(res.data.message),
//   });

//   /* ================= LANGUAGE ================= */
//   const changeLang = useMutation({
//     mutationFn: (lang: string) => {
//       const formData = new FormData();
//       formData.append("lang", lang);
//       return axios.post("auth/lang", formData);
//     },
//     onSuccess: (res) => toast.success(res.data.message),
//   });

//   if (isLoading) return <RollerLoading />;

//   return (
//     <div className="container mx-auto p-4 rounded-md">
//       <Tabs defaultActiveKey="1">
//         {/* ================= BASIC INFO ================= */}
//         <Tabs.TabPane tab="Profile Info" key="1">
//           <Form
//             form={profileForm}
//             layout="vertical"
//             onFinish={(values) => updateProfile.mutate(values)}
//             className="w-full py-10 px-2 sm:w-[50%] md:w-[40%]"
//           >
//             <Form.Item
//               name="name"
//               label={<FormattedMessage id="name" />}
//               rules={[{ required: true }]}
//             >
//               <Input
//                 name="name"
//                 size="large"
//                 placeholder={intl.formatMessage({ id: "name" })}
//               />
//             </Form.Item>

//             <Form.Item
//               name="email"
//               label={<FormattedMessage id="email" />}
//               rules={[
//                 {
//                   required: true,
//                   message: <FormattedMessage id="email" />,
//                 },
//                 {
//                   type: "email",
//                   message: <FormattedMessage id="invalid-email" />,
//                 },
//               ]}
//             >
//               <Input
//                 name="email"
//                 size="large"
//                 placeholder={intl.formatMessage({ id: "email" })}
//               />
//             </Form.Item>

//             {/* <Form.Item
//               label={<FormattedMessage id="password" />}
//               name="password"
//               rules={[
//                 {
//                   required: true,
//                   message: <FormattedMessage id="password-required" />,
//                 },
//               ]}
//             >
//               <Input.Password
//                 name="password"
//                 size="large"
//                 placeholder={intl.formatMessage({ id: "" })}
//               />
//             </Form.Item> */}

//             <Button
//               loading={updateProfile.isPending}
//               size="large"
//               className="w-full text-white min-w-[60px] md:min-w-[80px] mt-10 bg-[#3bab7b] hover:bg-[#3bab7b] inline-block"
//               htmlType="submit"
//             >
//               <FormattedMessage id="edit-profile" />
//             </Button>
//           </Form>
//         </Tabs.TabPane>

//         {/* ================= PASSWORD ================= */}
//         <Tabs.TabPane tab="Change Password" key="2">
//           <Form
//             form={passwordForm}
//             layout="vertical"
//             onFinish={(values) => changePassword.mutate(values)}
//             className="w-full py-10 px-2 sm:w-[50%] md:w-[40%]"
//           >
//             <Form.Item
//               name="current_password"
//               label="Current Password"
//               rules={[{ required: true }]}
//             >
//               <Input.Password />
//             </Form.Item>

//             <Form.Item
//               name="password"
//               label="New Password"
//               rules={[{ required: true }]}
//             >
//               <Input.Password />
//             </Form.Item>

//             <Form.Item
//               name="password_confirmation"
//               label="Confirm Password"
//               dependencies={["password"]}
//               rules={[{ required: true }]}
//             >
//               <Input.Password />
//             </Form.Item>

//             <Button
//               htmlType="submit"
//               loading={changePassword.isPending}
//               className="w-full bg-[#3bab7b] text-white"
//             >
//               Change Password
//             </Button>
//           </Form>
//         </Tabs.TabPane>

//         {/* ================= IMAGE ================= */}
//         <Tabs.TabPane tab="Profile Image" key="3">
//           <Upload
//             showUploadList={false}
//             beforeUpload={(file) => {
//               uploadImage.mutate(file);
//               return false;
//             }}
//           >
//             <Button className="w-full">Upload Image</Button>
//           </Upload>

//           {profile?.image && (
//             <img
//               src={profile.image}
//               alt="profile"
//               className="mt-4 w-32 h-32 rounded-full object-cover"
//             />
//           )}
//         </Tabs.TabPane>

//         {/* ================= SETTINGS ================= */}
//         <Tabs.TabPane tab="Settings" key="4">
//           <div className="flex items-center justify-between mb-4">
//             <span>Notifications</span>
//             <Switch
//               defaultChecked={profile?.active_notification}
//               onChange={(checked) => toggleNotification.mutate(checked ? 1 : 0)}
//             />
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={() => changeLang.mutate("ar")}>AR</Button>
//             <Button onClick={() => changeLang.mutate("en")}>EN</Button>
//           </div>
//         </Tabs.TabPane>
//       </Tabs>
//     </div>
//   );
// };

// export default Profile;

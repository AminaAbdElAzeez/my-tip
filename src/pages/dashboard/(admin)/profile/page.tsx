import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authAction from "store/auth/actions";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "utlis/library/helpers/axios";
import { Button, Form, Input, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import RollerLoading from "components/loading/roller";

const { logout } = authAction;
const Profile = () => {
  const dispatch = useDispatch();
  const [form] = useForm();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchProfileData = async () => {
    const { data } = await axios.get(`back/auth/profile`);
    const profile = data?.data;

    form.setFieldsValue({
      name: profile?.name,
      email: profile?.email,
    });

    return data;
  };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fetchProfile"],
    queryFn: fetchProfileData,
    // refetchInterval: 5000,
  });

  /////// edit profile mutation
  const editProfileMutation = useMutation({
    mutationFn: (values) => axios["put"](`back/auth/profile`, values),
    onSuccess: (res) => {
      const { message } = res?.data;
      // form.resetFields();

      toast.success(message, {
        position: "top-center",
        duration: 3000,
      });
      dispatch(logout());
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;
      console.log(err, err.message);

      toast.error(err.message, {
        position: "top-center",
        duration: 3000,
      });
    },
  });

  const editProfileFinish = (values: any) => {
    editProfileMutation.mutate(values);
  };

  return (
    <div className="container mx-auto px-4 rounded-md">
      {/* {profile.loading ? (
        <RollerLoading />
      ) : ( */}

      <Form
        layout="vertical"
        onFinish={editProfileFinish}
        form={form}
        className="w-full py-10 px-2 sm:w-[50%] md:w-[40%]"
      >
        <Form.Item
          label={<FormattedMessage id="name" />}
          name="name"
          rules={[{ required: true, message: <FormattedMessage id="name" /> }]}
        >
          <Input name="name" size="large" />
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="email" />}
          name="email"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="email" />,
            },
            {
              type: "email",
              message: <FormattedMessage id="invalid-email" />,
            },
          ]}
        >
          <Input name="email" size="large" />
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
          <Input.Password name="password" size="large" />
        </Form.Item>

        <Button
          // type="primary"

          size="large"
          className="w-full text-white min-w-[60px] md:min-w-[80px] mt-10 bg-[#3bab7b] hover:bg-[#3bab7b] inline-block"
          htmlType="submit"
          loading={editProfileMutation.isPending}
        >
          <FormattedMessage id="edit-profile" />
        </Button>
      </Form>

      {/* )} */}
    </div>
  );
};

export default Profile;

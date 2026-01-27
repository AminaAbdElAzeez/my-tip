import authAction from "store/auth/actions";
import { Avatar, Popover, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import profileActions from "store/profile/actions";
import { UserOutlined } from "@ant-design/icons";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { logout } = authAction;
const { removeProfileData } = profileActions;

export default function TopbarUser() {
  const dispatch = useDispatch();
 // const profile = useSelector((state: { Profile: any }) => state?.Profile);
  const navigate = useNavigate();

  const content = (
    <div className="min-w-[10rem] flex flex-col gap-[2px]">
      <Button
        className="w-full text-start"
        type="text"
        onClick={() => {
          navigate("/admin/profile");
        }}
      >
        <FormattedMessage id="Profile" />
      </Button>

      <Button
        className="w-full text-start"
        type="text"
        onClick={() => {
          dispatch(logout());
          dispatch(removeProfileData());
        }}
      >
        <FormattedMessage id="logout" />
      </Button>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottom">
      <div className="flex gap-2 h-10 items-center cursor-pointer">
        <Avatar icon={<UserOutlined />} />
      </div>
    </Popover>
  );
}

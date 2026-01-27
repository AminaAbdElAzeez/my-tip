import { Popover, Button } from "antd";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

export default function EditProfile() {
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
        <FormattedMessage id="Edit Profile" />
      </Button>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="top">
      <div className="flex gap-2 h-10 items-center cursor-pointer">
        <FaUserEdit size={24} className="text-[#611F5F]" />
      </div>
    </Popover>
  );
}

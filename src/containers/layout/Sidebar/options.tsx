import { FormattedMessage } from "react-intl";
import { PiCity } from "react-icons/pi";
import { LuBuilding2, LuTableProperties } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { RiDashboardLine } from "react-icons/ri";
import { BiChalkboard, BiSolidOffer } from "react-icons/bi";
import { LiaChalkboardSolid, LiaUsersSolid } from "react-icons/lia";
import { CgCommunity } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FaChartColumn } from "react-icons/fa6";

// Registrations

interface MenuItem {
  key: string;
  to?: string;
  icon?: any;
  label: any;
  onClick?: () => void;
  hidden?: boolean;
  disabled?: boolean;
  children?: MenuItem[];
}
// const getMenuItems: (profile: any) => MenuItem[] = (profile) => {
const getMenuItems: () => MenuItem[] = () => {
  //console.log("profileData",profile?.roles[0])
  //const role = profile?.roles[0].roleName;

  return [
    {
      key: "employers",
      to: "employers",
      label: <FormattedMessage id="employers" />,
      icon: <FaUsers className="!text-xl" />,

      disabled: false,
    },
    {
      key: "statistics",
      to: "statistics",
      label: <FormattedMessage id="statistics" />,
      icon: <FaChartColumn className="!text-xl" />,

      disabled: false,
    },
  ];
};
export default getMenuItems;

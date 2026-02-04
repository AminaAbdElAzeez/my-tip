import { FormattedMessage } from 'react-intl';
import { PiCity, PiHandWithdraw, PiUsersFourFill, PiUsersThreeFill, PiUserSwitch } from 'react-icons/pi';
import { LuBuilding2, LuTableProperties } from 'react-icons/lu';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { RiContactsBookFill, RiDashboardLine, RiFolderSettingsFill, RiSettings5Fill } from 'react-icons/ri';
import { BiChalkboard, BiSolidOffer, BiSupport } from 'react-icons/bi';
import { LiaChalkboardSolid } from 'react-icons/lia';
import { CgCommunity } from 'react-icons/cg';
import { FaBusinessTime, FaFunnelDollar, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';
import {
  FaChartColumn,
  FaSackDollar,
  FaUsersGear,
  FaUsersLine,
  FaUsersRectangle,
  FaUsersViewfinder,
} from 'react-icons/fa6';
import { LiaUsersSolid } from 'react-icons/lia';
import { FaRegChartBar } from 'react-icons/fa';
import { SlSocialDropbox } from "react-icons/sl";
import { MdAppShortcut, MdOutlineContactMail, MdSwitchAccount } from 'react-icons/md';
import { IoMdNotifications } from 'react-icons/io';
import { AiOutlineDollarCircle } from 'react-icons/ai';


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

const ADMIN = 1;
const EMPLOYER = 2;

// const getMenuItems: (profile: any) => MenuItem[] = (profile) => {
const getMenuItems = (type: number) => {
  //console.log("profileData",profile?.roles[0])
  //const role = profile?.roles[0].roleName;

  return [
    // ===== ADMIN =====
    {
      key: 'statistics',
      to: 'statistics',
      label: <FormattedMessage id="statistics" />,
      icon: <FaRegChartBar className="!text-xl" />,
      allowRoles: [ADMIN],
    },
    {
      key: 'employers',
      // to: 'users',
      label: <FormattedMessage id="employers" />,
      icon: <FaUsersViewfinder className="!text-xl" />,
      allowRoles: [ADMIN],
      children: [
        {
          key: 'employers',
          to: 'employers',
          icon: <FaUsersLine className="!text-xl" />,
          label: <FormattedMessage id="allEmployers" />,
        },
        {
          key: 'employers/pending',
          to: 'employers/pending',
          icon: <FaUsersGear className="!text-xl" />,
          label: <FormattedMessage id="pendingRequests" />,
        },
      ],
    },
    {
      key: 'users',
      // to: 'users',
      label: <FormattedMessage id="users" />,
      icon: <FaUsersRectangle className="!text-xl" />,
      allowRoles: [ADMIN],
      children: [
        {
          key: 'users',
          to: 'users',
          label: <FormattedMessage id="allUsers" />,
          icon: <LiaUsersSolid className="!text-xl" />,
        },
        {
          key: 'users/pending',
          to: 'users/pending',
          label: <FormattedMessage id="pendingRequests" />,
          icon: <PiUserSwitch className="!text-xl" />,
        },
      ],
    },
    {
      key: 'setting  managment',
      // to: 'users',
      label: <FormattedMessage id="settingManagment" />,
      icon: <RiFolderSettingsFill className="!text-xl" />,
      allowRoles: [ADMIN],
      children: [
        {
          key: 'socialMedia',
          to: 'socialMedia',
          label: <FormattedMessage id="socialMedia" />,
          icon: <SlSocialDropbox className="!text-xl" />,
        },
        {
          key: 'appVersion',
          to: 'appVersion',
          label: <FormattedMessage id="appVersion" />,
          icon: <MdAppShortcut className="!text-xl" />,
        },
        {
          key: 'contactTypes',
          to: 'contactTypes',
          label: <FormattedMessage id="contactTypes" />,
          icon: <MdOutlineContactMail className="!text-xl" />,
        },
        // {
        //   key: 'suggestionTypes',
        //   to: 'suggestionTypes',
        //   label: <FormattedMessage id="suggestionTypes" />,
        // },
        {
          key: 'settings',
          to: 'settings',
          label: <FormattedMessage id="settings" />,
          icon: <RiSettings5Fill className="!text-xl" />,
        },
        {
          key: 'notification',
          to: 'notification',
          label: <FormattedMessage id="notification" />,
          icon: <IoMdNotifications className="!text-xl" />,
        },
        {
          key: 'businessTypes',
          to: 'businessTypes',
          label: <FormattedMessage id="businessTypes" />,
          icon: <FaBusinessTime className="!text-xl" />,
        },
      ],
    },
    {
      key: 'banks',
      to: 'banks',
      label: <FormattedMessage id="banks" />,
      icon: <AiOutlineDollarCircle className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'suggestions',
      to: 'suggestions',
      label: <FormattedMessage id="suggestions" />,
      icon: <FaHandHoldingHeart className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'contacts',
      to: 'contacts',
      label: <FormattedMessage id="contacts" />,
      icon: <MdSwitchAccount className="!text-xl" />,
      allowRoles: [ADMIN],
    },
    {
      key: 'withdrawals',
      to: 'withdrawals',
      label: <FormattedMessage id="withdrawals" />,
      icon: <PiHandWithdraw className="!text-xl" />,
      allowRoles: [ADMIN],
    },
    {
      key: 'tips',
      to: 'tips',
      label: <FormattedMessage id="tips" />,
      icon: <BiSupport className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    // ===== EMPLOYER =====

    {
      key: 'withdrawals',
      to: 'withdrawals',
      label: <FormattedMessage id="withdrawals" />,
      icon: <PiUsersThreeFill className="!text-xl" />,
      allowRoles: [EMPLOYER],
    },
  ].filter((item) => !item.allowRoles || item.allowRoles.includes(type));
};

export default getMenuItems;

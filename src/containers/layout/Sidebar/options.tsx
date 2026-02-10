import { FormattedMessage } from 'react-intl';
import {
  PiCity,
  PiHandWithdraw,
  PiUsersFourFill,
  PiUsersThreeFill,
  PiUserSwitch,
} from 'react-icons/pi';
import { LuBuilding2, LuTableProperties } from 'react-icons/lu';
import { HiMiniWallet, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import {
  RiContactsBookFill,
  RiDashboardLine,
  RiFolderSettingsFill,
  RiSettings5Fill,
} from 'react-icons/ri';
import { BiChalkboard, BiSolidOffer, BiSupport } from 'react-icons/bi';
import { LiaAmazonPay, LiaChalkboardSolid } from 'react-icons/lia';
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
import { SlSocialDropbox } from 'react-icons/sl';
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
  const basePath = type === ADMIN ? '/admin' : '/employer';

  //console.log("profileData",profile?.roles[0])
  //const role = profile?.roles[0].roleName;

  return [
    // ===== ADMIN =====
    {
      key: `${basePath}/statistics`,
      to: `${basePath}/statistics`,
      label: <FormattedMessage id="statistics" />,
      icon: <FaRegChartBar className="!text-xl" />,
      allowRoles: [ADMIN,EMPLOYER],
    },
    {
      key: 'employers',
      // to: 'users',
      label: <FormattedMessage id="employers" />,
      icon: <FaUsersViewfinder className="!text-xl" />,
      allowRoles: [ADMIN],
      children: [
        {
          key: `${basePath}/employers`,
          to: `${basePath}/employers`,
          icon: <FaUsersLine className="!text-xl" />,
          label: <FormattedMessage id="allEmployers" />,
        },
        {
          key: `${basePath}/employers/pending`,
          to: `${basePath}/employers/pending`,
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
          key: `${basePath}/users`,
          to: `${basePath}/users`,
          label: <FormattedMessage id="allUsers" />,
          icon: <LiaUsersSolid className="!text-xl" />,
        },
        {
          key: `${basePath}/users/pending`,
          to: `${basePath}/users/pending`,
          label: <FormattedMessage id="pendingRequests" />,
          icon: <PiUserSwitch className="!text-xl" />,
        },
      ],
    },
    {
      key: 'setting managment',
      // to: 'users',
      label: <FormattedMessage id="settingManagment" />,
      icon: <RiFolderSettingsFill className="!text-xl" />,
      allowRoles: [ADMIN],
      children: [
        {
          key: `${basePath}/socialMedia`,
          to: `${basePath}/socialMedia`,
          label: <FormattedMessage id="socialMedia" />,
          icon: <SlSocialDropbox className="!text-xl" />,
        },
        {
          key: `${basePath}/appVersion`,
          to: `${basePath}/appVersion`,
          label: <FormattedMessage id="appVersion" />,
          icon: <MdAppShortcut className="!text-xl" />,
        },
        {
          key: `${basePath}/contactTypes`,
          to: `${basePath}/contactTypes`,
          label: <FormattedMessage id="contactTypes" />,
          icon: <MdOutlineContactMail className="!text-xl" />,
        },
        // {
        //   key: 'suggestionTypes',
        //   to: 'suggestionTypes',
        //   label: <FormattedMessage id="suggestionTypes" />,
        // },
        {
          key: `${basePath}/settings`,
          to: `${basePath}/settings`,
          label: <FormattedMessage id="settings" />,
          icon: <RiSettings5Fill className="!text-xl" />,
        },
        {
          key: `${basePath}/notification`,
          to: `${basePath}/notification`,
          label: <FormattedMessage id="notification" />,
          icon: <IoMdNotifications className="!text-xl" />,
        },
        {
          key: `${basePath}/businessTypes`,
          to: `${basePath}/businessTypes`,
          label: <FormattedMessage id="businessTypes" />,
          icon: <FaBusinessTime className="!text-xl" />,
        },
      ],
    },
    {
      key: `${basePath}/banks`,
      to: `${basePath}/banks`,
      label: <FormattedMessage id="banks" />,
      icon: <AiOutlineDollarCircle className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: `${basePath}/suggestions`,
      to: `${basePath}/suggestions`,
      label: <FormattedMessage id="suggestions" />,
      icon: <FaHandHoldingHeart className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: `${basePath}/contacts`,
      to: `${basePath}/contacts`,
      label: <FormattedMessage id="contacts" />,
      icon: <MdSwitchAccount className="!text-xl" />,
      allowRoles: [ADMIN],
    },
    {
      key: `${basePath}/withdrawals`,
      to: `${basePath}/withdrawals`,
      label: <FormattedMessage id="withdrawals" />,
      icon: <PiHandWithdraw className="!text-xl" />,
      allowRoles: [ADMIN],
    },
    {
      key: `${basePath}/tips`,
      to: `${basePath}/tips`,
      label: <FormattedMessage id="tips" />,
      icon: <BiSupport className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    // ===== EMPLOYER =====
    {
      key: `${basePath}/paymentMethods`,
      to: `${basePath}/paymentMethods`,
      label: <FormattedMessage id="paymentMethod" />,
      icon: <HiMiniWallet className="!text-xl" />,
      allowRoles: [EMPLOYER],
    },
  ].filter((item) => !item.allowRoles || item.allowRoles.includes(type));
};

export default getMenuItems;

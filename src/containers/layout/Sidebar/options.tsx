import { FormattedMessage } from 'react-intl';
import { PiCity, PiUsersThreeFill } from 'react-icons/pi';
import { LuBuilding2, LuTableProperties } from 'react-icons/lu';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { RiDashboardLine } from 'react-icons/ri';
import { BiChalkboard, BiSolidOffer } from 'react-icons/bi';
import { LiaChalkboardSolid } from 'react-icons/lia';
import { CgCommunity } from 'react-icons/cg';
import { FaUsers } from 'react-icons/fa';
import { FaChartColumn, FaSackDollar } from 'react-icons/fa6';
import { LiaUsersSolid } from 'react-icons/lia';

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
      key: 'employers',
      to: 'employers',
      label: <FormattedMessage id="employers" />,
      icon: <FaUsers className="!text-xl" />,
      allowRoles: [ADMIN, EMPLOYER], // مشترك
    },

    {
      key: 'statistics',
      to: 'statistics',
      label: <FormattedMessage id="statistics" />,
      icon: <FaChartColumn className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'banks',
      to: 'banks',
      label: <FormattedMessage id="banks" />,
      icon: <FaSackDollar className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'users',
      to: 'users',
      label: <FormattedMessage id="users" />,
      icon: <PiUsersThreeFill className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'suggestions',
      to: 'suggestions',
      label: <FormattedMessage id="suggestions" />,
      icon: <PiUsersThreeFill className="!text-xl" />,
      allowRoles: [ADMIN],
    },

    {
      key: 'contacts',
      to: 'contacts',
      label: <FormattedMessage id="contacts" />,
      icon: <PiUsersThreeFill className="!text-xl" />,
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

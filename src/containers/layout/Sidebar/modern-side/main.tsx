import { Button, theme } from "antd";
// import EditProfile from "components/EditProfile/EditProfile";
import SmallLogo from "components/LogoWraper/small-logo";
// import Topbar from 'containers/layout/Topbar'
import LangSwitcher from "containers/layout/Topbar/LangSwitcher";
import ThemesSwitcher from "containers/layout/Topbar/ThemesSwitcher";
import TopbarUser from "containers/layout/Topbar/TopbarUser";
import { TargetAndTransition, VariantLabels } from "framer-motion";
import React from "react";
const ANIMATION_MENU_ITEM_HOVER: VariantLabels | TargetAndTransition = {
  // scale:1.2,
  backgroundColor: "#3730a3",
  color: "#fff",
};
interface IMainSide {
  width: ISIdeWidth;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
// width: 100%;
//     height: 64px;
function MainSide({ setCollapsed, collapsed, width }: IMainSide) {
  const { token } = theme.useToken();
  // const {  isDark} = useSelector(
  //   ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) =>
  //     ThemeSwitcher
  // );
  return (
    <>
      <style>
        {`
        .main-side{
          width:100%;
          background-color:${token.colorBgContainer};
          border-color:${token.colorBorder};
        }
        @media (min-width: 640px){
    .main-side{
      width:${width.main}px;
    }
  }
    
    `}
      </style>
      <div
        className={`border-solid sm:border-none border-0 border-t shadow-md dark:shadow-black main-side bottom-0 left-0 sm:left-[initial] justify-between sm:justify-start h-[60px]  sm:h-full box-border fixed flex-row sm:flex-col items-center py-2 sm:py-4 px-4 sm:px-0 flex ltr:sm:rounded-tr-3xl ltr:sm:rounded-br-3xl rtl:sm:rounded-tl-3xl rtl:sm:rounded-bl-3xl`}
      >
        <div className="sm:py-2 hidden sm:block">
          <SmallLogo />
        </div>
        <div className="flex gap-2 flex-row sm:flex-col items-center sm:flex-1 sm:p-2 ">
          <button
            onClick={() => {
              setCollapsed((old) => !old);
            }}
            className={`border-slate-300 dark:border-[#3e3e3e] dark:bg-[#151516] dark:text-white border border-solid  rounded-md shadow-md dark:shadow-black px-2 py-1 cursor-pointer`}
          >
            <span className="sr-only">Toggle sidebar</span>
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>
        <div className="flex sm:flex-col items-center justify-center gap-2">
          <ThemesSwitcher />
          {/* <EditProfile /> */}

          <LangSwitcher />
          <TopbarUser />
        </div>
      </div>
    </>
  );
}

export default MainSide;

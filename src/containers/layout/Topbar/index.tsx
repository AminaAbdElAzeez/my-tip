"use custom";
import { Layout, Button, theme, Breadcrumb } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import TopbarUser from "./TopbarUser";
import LangSwitcher from "./LangSwitcher";
// import { Link, useLocation } from "react-router-dom";
// import { ReactNode } from "react";
// import { FormattedMessage } from "react-intl";
import ThemesSwitcher from "./ThemesSwitcher";
const { Header } = Layout;

function Topbar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: Function;
}) {
  const { token } = theme.useToken();
  // const location = useLocation();
  // const pathSnippets = location.pathname.split("/").filter((i) => isNaN(+i));

  // const extraBreadcrumbItems = pathSnippets.map((routeName, index) => {
  //   const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
  //   const title = <FormattedMessage id={routeName} />;
  //   return {
  //     key: url,
  //     title:
  //       index === pathSnippets.length - 1 ? (
  //         title
  //       ) : (
  //         <Link to={url}>{title}</Link>
  //       ),
  //   };
  // });

  // const breadcrumbItems = [
  //   {
  //     title: (
  //       <Link to="/">
  //         <FormattedMessage id="home" />
  //       </Link>
  //     ) as ReactNode,
  //     key: "home",
  //   },
  // ].concat(extraBreadcrumbItems);

  return (
    <Header
      className="h-[64px] top-0 sticky p-2 flex justify-between items-center shadow z-10 "
      style={{
        backgroundColor: token.colorBgContainer,
        // === "#000" ? "#00000099" : "#ffffff99",
      }}
    >
      <div className="isoLeft flex items-center gap-4">
        <Button
          className="text-base w-9 h-9"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        {/* <Breadcrumb className="text-sm" items={breadcrumbItems} /> */}
      </div>
      <ul className="flex gap-1 items-center">
        <li className="isoUser">
          {" "}
          <ThemesSwitcher />{" "}
        </li>
        <li className="isoUser">
          {" "}
          <LangSwitcher />{" "}
        </li>
        <li className="isoUser">
          {" "}
          <TopbarUser />{" "}
        </li>
      </ul>
    </Header>
  );
}

export default Topbar;

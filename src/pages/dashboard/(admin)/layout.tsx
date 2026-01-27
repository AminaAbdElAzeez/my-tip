import { useEffect, useState } from "react";
import { Breadcrumb, Layout, theme } from "antd";
import Footer from "containers/layout/Footer";
import Sidebar from "containers/layout/Sidebar";
import Topbar from "containers/layout/Topbar";
import TranslateLayoutAnimation from "components/AnimationLayout/Translate";
import middleware from "utlis/navigation/mw";
import { PrivatePages } from "middlewares";
import ScrollerRenderView from "components/scroller-render-view";
// import bg from "../../assets/dashboard/cool-background.webp";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ReactNode } from "react";

import { FormattedMessage } from "react-intl";
import axios from "utlis/library/helpers/axios";
import { useDispatch, useSelector } from "react-redux";
import { permissionsTransform } from "utlis/library/helpers/permissions";
import { ScrollYProgressAnimation } from "components/AnimationLayout/ScrollYProgressAnimation";
import Sider from "containers/layout/Sidebar/modern-side";
import { motion } from "framer-motion";
import useSwiper from "utlis/library/hooks/useSwiper";
import { useNavigation, useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import { ExpirationTokenGuard } from "middlewares/Expiration.mw";
import RollerLoading from "components/loading/roller";
import profileActions from "store/profile/actions";

const { Content } = Layout;

const { fetchProfileDataSuccess } = profileActions;

function DashboardLayout({ children }: { children?: any }) {
  const navigation = useNavigation();
  const navigate = useNavigate();
 // const profile = useSelector(({ profile }) => profile.data);
  //const role = profile?.roles[0].roleName;
  // useEffect(() => {
  //   if (navigation.state === "loading") {
  //     NProgress.start();
  //   } else {
  //     NProgress.done();
  //   }

  //   // return () => {
  //   // };
  // }, [navigation.state]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { dir } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );

  const { idToken } = useSelector((state: any) => state.Auth);

  // console.log("idToken",idToken)
  // console.log("profile",profile)
  // useEffect(() => {
  //   if (role !== "Admin") {
  //     navigate("/login");
  //   }
  //   if (
  //     profile?.id &&
  //     profile.isVerified &&
  //     profile.isActivated &&
  //     profile.isApproved
  //   ) {
  //     axios["get"](`Operations/info`, {
  //       headers: {
  //         "X-Portal": "dashboard",
  //         Authorization: `Bearer ${idToken}`,
  //       },
  //     })
  //       .then((response) => {
  //         const { data } = response.data;
  //         data.isVerified = true;
  //         if (data.approvalStatus === "Approved") {
  //           data.isApproved = true;
  //         }
  //         if (data.userActivated) {
  //           data.isActivated = true;
  //         }
  //         //  let permissions=data.roles.reduce((acc , curr)=> [...acc , ...curr.permissions] ,[])
  //         //  permissions = permissionsTransform(permissions);
  //         //  data.permissions=permissions
  //         dispatch(fetchProfileDataSuccess(data));
  //       })
  //       .catch((error) => {});
  //   }
  // }, []);
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const pathSnippets = location.pathname.split("/").filter((i) => isNaN(+i));

  const extraBreadcrumbItems = pathSnippets.map((routeName, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const title = <FormattedMessage id={routeName} />;
    return {
      key: url,
      title:
        index === pathSnippets.length - 1 ? (
          title
        ) : (
          <Link to={url}>{title}</Link>
        ),
    };
  });
  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <FormattedMessage id="home" />
        </Link>
      ) as ReactNode,
      key: "home",
    },
  ].concat(extraBreadcrumbItems);
  const swipeHandlers = useSwiper({
    onSwipedLeft() {
      setCollapsed(dir === "ltr" ? false : true);
    },
    onSwipedRight() {
      setCollapsed(dir === "ltr" ? true : false);
    },
  });
  return (
    <>
      <div className="flex h-[100dvh]">
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* <Layout hasSider> */}
        {/* <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        width={collapsed ? FOLDED_SIDEBAR_WIDTH : UNFOLDED_SIDEBAR_WIDTH}
      /> */}
        {/* <Layout
        className="site-layout"
        style={{
          marginInlineStart: "auto",
          backdropFilter: "blur(20px)",
          backgroundColor: colorBgLayout + "ee",

          minHeight: "100dvh",
          transition: "all .5s linear",
          animationIterationCount: "infinite",
          maxWidth: `calc(100% - ${
            collapsed ? FOLDED_SIDEBAR_WIDTH : UNFOLDED_SIDEBAR_WIDTH
          }px)`,
        }}
      > */}
        {/* <Topbar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
        <ScrollerRenderView
          className={`!h-[calc(100dvh_-_60px)]  sm:!h-[calc(100dvh)]`}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <Content
            {...swipeHandlers}
            style={{ margin: "24px 16px 0", overflow: "initial" }}
          >
            <div
              className={`py-4 box-border min-h-[calc(100dvh_-_24px_-_45px_-_60px)]  sm:min-h-[calc(100dvh_-_24px_-_45px)]`}
            >
              {/* <motion.div
            key={breadcrumbItems.at(-1).key}
            initial={{
              x:"100vw"
            }}
            animate={{
              x:0
            }}
            transition={{delay:.5}}
            className="mb-4 max-w-fit"> */}

              <Breadcrumb className="text-sm mb-2" items={breadcrumbItems} />
              {/* </motion.div> */}

              <TranslateLayoutAnimation>
                <Outlet />
                {/* <p>hiii</p> */}
              </TranslateLayoutAnimation>
            </div>
          </Content>

          <Footer />
        </ScrollerRenderView>
        {/* </Layout> */}
        {/* </Layout> */}
      </div>
    </>
  );
}

export default middleware(DashboardLayout, [PrivatePages]);
//export default DashboardLayout;

import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
import MyMenu from './menu';
import { useSelector } from 'react-redux';
import ScrollerRenderView from 'components/scroller-render-view';
import LogoWraper from 'components/LogoWraper';

const { Sider } = Layout;

function Sidebar({
  collapsed,
  width,
  setCollapsed,
}: {
  collapsed: boolean;
  width: number;
  setCollapsed: any;
}) {
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language
  );
  // const {theme:currentTheme , isDark} = useSelector(
  //   ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) =>
  //     ThemeSwitcher
  // );
  const { token } = theme.useToken();
  return (
    <Sider
      breakpoint="lg"
      onBreakpoint={(broken) => {
        setCollapsed(broken);
      }}
      trigger={null}
      collapsible
      collapsed={collapsed}
      className=" !block z-10"
      style={{
        position: 'fixed',
        top: 0,
        [locale === 'ar' ? 'right' : 'left']: 0,
        bottom: 0,
        transition: 'all .5s linear',
        animationIterationCount: 'infinite',
        flex: 'none',
        backgroundColor: token.colorBgContainer,
        // === "#000" ? "#000000f8" : "#ffffffee",
        backdropFilter: 'blur(20px)',
        // borderInlineEnd: "1px solid #eee",
      }}
      width={width}
      collapsedWidth={width}
    >
      <LogoWraper>
        <Link
          className="flex overflow-hidden items-center text-[#3bab7b] hover:text-[#3bab7b] no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
          to="/"
        >
          {!collapsed ? (
            <img
              width={200}
              height={64}
              className="w-[200px] h-auto object-cover dark:contrast-50"
              src={'/logo.svg'}
            />
          ) : (
            <img
              className="w-14 h-auto"
              src="/logo.svg"
              width={52}
              height={73}
              alt="proffer-admin"
            />
          )}
        </Link>
      </LogoWraper>

      <ScrollerRenderView
        style={{ height: 'calc(100dvh - 65px)' }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <MyMenu collapsed={true} />
      </ScrollerRenderView>
    </Sider>
  );
}

export default Sidebar;

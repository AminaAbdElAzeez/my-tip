import ScrollerRenderView from "components/scroller-render-view";
import MyMenu from "../menu";
import { motion } from "framer-motion";
import { theme } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SubSide({
  width,
  collapsed,
  variantsSubSide,
}: {
  width: ISIdeWidth;
  collapsed: boolean;
  variantsSubSide: any;
}) {
  const { token } = theme.useToken();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDark();

    // Observer to watch for class changes
    const observer = new MutationObserver(() => {
      checkDark();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Clean up
    return () => observer.disconnect();
  }, []);

  const logoSrc = isDarkMode ? "/logo.svg" : "/logo.svg";

  return (
    <motion.div
      variants={variantsSubSide}
      style={{
        backgroundColor: token.colorBgContainer,
        width: width.sub,
      }}
      className={` ltr:pl-16 rtl:pr-16  box-border inset-y-0  border-r-2 border-indigo-100 shadow-md  ltr:rounded-tr-3xl ltr:rounded-br-3xl rtl:rounded-tl-3xl rtl:rounded-bl-3xl  `}
    >
      <div className="flex items-center justify-center flex-shrink-0 pt-10 pb-2 ">
        <Link to={"/"} target="_blank" className="block">
          <img
            // className="w-20 h-auto"
            className="w-[160px] h-[60px]"
            src={logoSrc}
            width={172}
            height={39}
            alt="Erth Admin"
          />
        </Link>
      </div>
      <ScrollerRenderView
        className={`!h-[calc(100dvh_-_153px_-_13px)]  sm:!h-[calc(100dvh_-_153px)]`}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <div className="px-4 ">
          <MyMenu collapsed={collapsed} />
        </div>
      </ScrollerRenderView>
    </motion.div>
  );
}

export default SubSide;

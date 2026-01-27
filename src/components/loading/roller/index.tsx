import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useState } from "react";
function RollerLoading() {
  // console.log("rendered RollerLoading");

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
    <div
      // style={{ height: "calc(100vh - 200px)" }}
      className="flex flex-col items-center justify-center h-[100vh]"
    >
      <div className="drop-shadow-xl ">
        <img
          loading="eager"
          // width={60}
          // height={60}
          className="w-[114px] h-auto"
          src={logoSrc}
          alt="Toma Admin"
        />
      </div>
      <Spin size="large" className="dark:text-[burlywood] mt-5" />
    </div>
  );
}

export default RollerLoading;

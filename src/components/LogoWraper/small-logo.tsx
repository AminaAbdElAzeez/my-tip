import { useIsFetching } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SmallLogo() {
  const isFetching = useIsFetching();
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
    <Link className="inline-block" to={"/"}>
      <motion.img
        className={`w-12  ${isFetching ? "motion-safe:animate-wiggle" : ""}`}
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        // width={52}
        // height={37}
        transition={{ delay: 0.3, type: "spring", stiffness: 60 }}
        src={logoSrc}
        alt="logo"
      />
    </Link>
  );
}

export default React.memo(SmallLogo);

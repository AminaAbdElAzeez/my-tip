import { Footer as AntdFooter } from "antd/es/layout/layout";
import { FormattedMessage } from "react-intl";

function Footer() {
  return (
    <AntdFooter
      dir="ltr"
      className=" p-0 bg-transparent h-[45px] flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis"
    >
      Erth © {new Date().getFullYear()}
      <span className="inline-flex gap-1 ms-1">
        {" "}
        By{" "}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://erth.appssquare.com"
          className="!text-[#611F5F]"
        >
          <FormattedMessage id="footer" />
        </a>
      </span>
    </AntdFooter>
  );
}

export default Footer;

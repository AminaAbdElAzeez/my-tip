import React, { ReactNode, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import { useSelector } from "react-redux";
import { transition } from '../../utlis/library/helpers/style_utils';
import { URL } from "utlis/library/helpers/axios";

const UploadFiles: React.FC<{
  url: string;
  fileName: string;
  children: ReactNode;
  setRefresher: any;
}> = ({ url, fileName, children, setRefresher }) => {
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );
    const { idToken } = useSelector((state: any) => state.Auth);
const [files , setFiles] = useState([])
  const props: UploadProps = {
    name: fileName,
    fileList:files ,
    maxCount:1,
    action: `${URL}/api/admin/${url}`,
    // headers: {
    //   "X-Language": locale ?? "en",
    //   Authorization: `Bearer ${idToken}`,
    //   "Accept-Language": locale ?? "en",
    // },
    onChange(info) {
          const fileList = [...info.fileList];
setFiles(fileList);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setFiles([]);
        message.success(info.file.response.message);
        setRefresher((old) => !old);
      } else if (info.file.status === "error") {
        setFiles([]);
        message.error(info.file.response.message);

      }
    },
  };
  return (
    <div className="upload-wraper relative">
      <style>
        {`
  .upload-wraper .ant-upload-list{
position: absolute;
    top: -8px;
    ${locale === "ar" ? "left" : "right"}: -4px;
    height:40px;
    transform: translate(0 , 0);
    background: #fff;
    border-radius: 5px;
    z-index:100;
    transition:none;
  }
    .upload-wraper .ant-upload-list > div {
    margin: 5px 10px;
  }
  `}
      </style>

      <Upload {...props}>
        <Button className="focus-visible:!outline-none" icon={<UploadOutlined />}>{children}</Button>
      </Upload>
    </div>
  );
};

export default UploadFiles;

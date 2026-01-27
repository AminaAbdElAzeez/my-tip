import { Result } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { getPermissions } from "utlis/library/helpers/permissions";

const PermissionGuard = function (route, type) {
  return function Comp(Component) {
    const { data } = useSelector((state: any) => state.profile);
    
    return getPermissions(route, type, data)
      ? Component
      : () => (
          <Result
            status="403"
            title="403"
            subTitle={<FormattedMessage id="message.unauthorized" />}
            //   extra={<Button type="primary">Back Home</Button>}
          />
        );
  };
};
// }
export default PermissionGuard;

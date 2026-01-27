import { Button, Result } from "antd"
import { useSelector } from "react-redux";

function FallBackUI() {
  const profile = useSelector((state: { Profile: any }) => state.Profile);
  const role = profile?.roles[0].roleName;
  return (
    <div className="flex items-center justify-center min-h-[100dvh]">  <Result
    status="warning"
    title="There are some problems with your operation."
    extra={<a href="/login">go home</a>}
  /></div>
  )
}

export default FallBackUI
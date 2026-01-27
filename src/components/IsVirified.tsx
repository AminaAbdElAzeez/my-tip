import { Button, Modal } from "antd";
import { title } from "process";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authAction from "store/auth/actions";
const { logout } = authAction;
export function IsVirified(props){
  //const profile = useSelector(({ profile }) => profile.data);
const navigate = useNavigate()
  const dispatch = useDispatch()

  return <>
     <Modal
          title="virify account"
          closeIcon={false}
          open={true}
          okText={null}
          // okText={<FormattedMessage id="virify" />}
          cancelText={<FormattedMessage id="logout" />}
          // onOk={()=>{
          //   navigate(`/verify`, {
          //     state: {
          //       from: "after-login",
          //       email: profile.email,
          //       phone: `${profile.countryCode}_${profile.phoneNumber}`
          //     }
          //   });

          // }}
          onOk={null}
          onCancel={()=>dispatch(logout())}
          // footer={[<Button type="primary" onClick={() => dispatch(logout())}>Redirect</Button>]}
      >
        <p>We're sorry, but your account not virified.</p>
        <p>You need to virify your account. Thank you for your understanding.</p>
      </Modal> 
     
      </>
}
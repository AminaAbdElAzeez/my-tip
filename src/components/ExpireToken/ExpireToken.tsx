import { Button, Modal } from "antd";
import { title } from "process";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authAction from "store/auth/actions";
const { logout } = authAction;
export function ExpireHandling({msg ,title}){
const [timer , setTimer] = useState(15)

useEffect(()=>{
  let clearTimer
if(timer>0){
  clearTimer= setTimeout(()=>{
    setTimer(old=>old-1)
  },1000)
}else{
  dispatch(logout())
}
return()=>clearTimeout(clearTimer)


},[timer])
  const dispatch = useDispatch()

  return <>
     <Modal
          title={title}
          closeIcon={false}
          open={true}
          footer={[<Button type="primary" onClick={() => dispatch(logout())}>Redirect</Button>]}
      >
      {msg}
        <p>You will be directed to the login page within {timer} seconds.</p>
      </Modal> 
     
      </>
}
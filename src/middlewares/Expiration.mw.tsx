import { Button, Modal, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import authAction from "store/auth/actions";
const { logout } = authAction;

export function ExpirationTokenGuard(Comp: any, next: any) {
    const { status } = useSelector((state: { Auth: IAuth }) => state.Auth);
    
    

    if (status !== "EXPIRED") {
        return next(Comp)
    }

    return next(()=><Comp><ExpireHandling/> </Comp>)
    // return next(Comp)
}
function ExpireHandling(props){

    const dispatch = useDispatch()

    return <>
    <Button type="primary" onClick={() => dispatch(logout())}>Redirect</Button>
        {/* <Modal
            title="Your session has expired"
            closeIcon={false}
            open={true}
            footer={[<Button type="primary" onClick={() => dispatch(logout())}>Redirect</Button>]}
        >
            <p>
                You will be directed to the login page within {'secondsToGo'} seconds.
            </p>
        </Modal> */}
       
        </>
}
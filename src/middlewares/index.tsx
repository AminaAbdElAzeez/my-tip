import { Button } from "antd";
import { ExpireHandling } from "components/ExpireToken/ExpireToken";
import { IsVirified } from "components/IsVirified";
import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export function LoggedUserCanNotOpen(Comp: any, next: any) {
  const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);
  //const profile = useSelector(({ profile }) => profile.data);
  const profile = (state: { Profile: any }) => state.Profile;
  // const role = profile?.roles[0].roleName;
  useEffect(() => {
    // console.log('idToken',idToken)
  }, [idToken]);
  // console.log("role",role)
  if (idToken) {
    // if(role==="Admin"){

    return () => <Navigate to={"/admin/employers"} replace />;

    // return () => <Navigate to={"/admin/master-data/branches"} replace />;

    // }
    // else if (role==="TechSupport") {
    //   return  ()=><Navigate to={'/tech/containers'} replace />
    // }
    // else  {
    //   return  ()=><Navigate to={'/financial/transactions'} replace />
    // }
  }

  return next(Comp);
}

export function PrivatePages(Comp: any, next: any) {
  const { status, idToken, to } = useSelector(
    (state: { Auth: IAuth }) => state.Auth
  );
  const profile = useSelector(({ Profile }) => Profile?.data);

  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!idToken) {
  //     navigate("/login");
  //   }
  // }, [idToken]);
  if (!idToken) {
    return () => <Navigate to={to} replace />;
  }
  // if (!profile.isVerified) {
  //   return next(() => (
  //     <Comp>
  //       <IsVirified />{" "}
  //     </Comp>
  //   ));
  // }
  // if (!profile.isActivated) {
  //   return next(() => (
  //     <Comp>
  //       <ExpireHandling
  //         title={"Account not active"}
  //         msg={
  //           <>
  //             <p>We're sorry, but your account not active yet.</p>
  //             <p>Please log in later. Thank you for your understanding.</p>
  //           </>
  //         }
  //       />{" "}
  //     </Comp>
  //   ));
  //}

  // if (!profile.isApproved) {
  //   return next(() => (
  //     <Comp>
  //       <ExpireHandling
  //         title={"Account not approved"}
  //         msg={
  //           <>
  //             <p>We're sorry, but your account not approved yet.</p>
  //             <p>Please log in later. Thank you for your understanding.</p>
  //           </>
  //         }
  //       />{" "}
  //     </Comp>
  //   ));
  // }

  if (status === "EXPIRED") {
    return next(() => (
      <Comp>
        <ExpireHandling
          title={"Your session has expired"}
          msg={
            <>
              <p>
                We're sorry, but your session has expired. For security reasons.
              </p>
              <p>Please log in again. Thank you for your understanding.</p>
            </>
          }
        />{" "}
      </Comp>
    ));
  }
  return next(Comp);
}

// export function MakeSureTypeEmailOrPhone(Comp: any, next: any) {
//   const {slug} = useParams()
//   const [type] =slug.split("-")
//   const types =['phone' , 'email']

//   if (!types.includes(type)) {
//    return ()=><Navigate to={'/404'} replace />
//   }
// return next(Comp)
// }

// export function MakeSureFromDirection(Comp: any, next: any) {
//   const {slug} = useParams()
//   const [from] =slug.split("-")
//   const fromWherePlaces =['signup' , 'forgot']

//   if (!fromWherePlaces.includes(from)) {
//    return ()=><Navigate to={'/404'} replace />
//   }
//   return next(Comp)
// }
export function ValidateVerifyState(Comp: any, next: any) {
  let location = useLocation();
  const { from, phone, email } = location.state || {};
  if (!from || !phone || !email) {
    return () => <Navigate to={"/404"} replace />;
  }
  return next(Comp);
}

export function ValidateOtpState(Comp: any, next: any) {
  let location = useLocation();
  const { from, type, value } = location.state || {};
  if (!from || !type || !value) {
    return () => <Navigate to={"/404"} replace />;
  }
  return next(Comp);
}

export function FromSignupShouldBeLoginedAndNotVerified(Comp: any, next: any) {
  const { slug } = useParams();
  const [, from] = slug.split("-");
  const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);
  const isVerified = false;
  if (from === "signup" && (!idToken || isVerified)) {
    return () => <Navigate to={"/404"} replace />;
  }
  return next(Comp);
}

export function FromSignupShouldBeLogined(Comp: any, next: any) {
  const { state } = useLocation();
  const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);
  if (!idToken || !state?.isDone) {
    return () => <Navigate to={"/404"} replace />;
  }
  return next(Comp);
}

export function ThereOtpAndPhoneOrEmail(Comp: any, next: any) {
  const { state } = useLocation();
  if (!state?.type && !state?.otp_code) {
    return () => <Navigate to={"/404"} replace />;
  }
  return next(Comp);
}

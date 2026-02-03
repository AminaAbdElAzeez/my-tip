import { Button } from 'antd';
import { ExpireHandling } from 'components/ExpireToken/ExpireToken';
import { IsVirified } from 'components/IsVirified';
import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

export function LoggedUserCanNotOpen(Comp: any, next: any) {
  return function ProtectedComponent(props: any) {
    const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);

    if (idToken) {
      return <Navigate to="/admin/statistics" replace />;
    }

    const Wrapped = next(Comp);
    return <Wrapped {...props} />;
  };
}

export function PrivatePages(Comp: any, next: any) {
  return function ProtectedComponent(props: any) {
    const { status, idToken, to } = useSelector((state: { Auth: IAuth }) => state.Auth);

    if (!idToken) {
      return <Navigate to="/login" replace />;
    }

    if (status === 'EXPIRED') {
      const Wrapped = next(() => (
        <Comp>
          <ExpireHandling
            title="Your session has expired"
            msg={
              <>
                <p>Your session expired.</p>
                <p>Please login again.</p>
              </>
            }
          />
        </Comp>
      ));

      return <Wrapped {...props} />;
    }

    const Wrapped = next(Comp);
    return <Wrapped {...props} />;
  };
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
    return () => <Navigate to={'/404'} replace />;
  }
  return next(Comp);
}

export function ValidateOtpState(Comp: any, next: any) {
  let location = useLocation();
  const { from, type, value } = location.state || {};
  if (!from || !type || !value) {
    return () => <Navigate to={'/404'} replace />;
  }
  return next(Comp);
}

export function FromSignupShouldBeLoginedAndNotVerified(Comp: any, next: any) {
  const { slug } = useParams();
  const [, from] = slug.split('-');
  const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);
  const isVerified = false;
  if (from === 'signup' && (!idToken || isVerified)) {
    return () => <Navigate to={'/404'} replace />;
  }
  return next(Comp);
}

export function FromSignupShouldBeLogined(Comp: any, next: any) {
  const { state } = useLocation();
  const { idToken } = useSelector((state: { Auth: IAuth }) => state.Auth);
  if (!idToken || !state?.isDone) {
    return () => <Navigate to={'/404'} replace />;
  }
  return next(Comp);
}

export function ThereOtpAndPhoneOrEmail(Comp: any, next: any) {
  const { state } = useLocation();
  if (!state?.type && !state?.otp_code) {
    return () => <Navigate to={'/404'} replace />;
  }
  return next(Comp);
}

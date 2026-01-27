import actions from "./actions";

const initState: IAuth = { idToken: null, status: "NOT_LOGGED", to: "/login" };

export default function authReducer(
  state = initState,
  action: IAuthAction
): IAuth {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        idToken: action.payload.token,
        status: "NOT_EXPIRED",
        to: "/admin/employers",
      };
    case actions.LOGOUT:
      return {
        idToken: null,
        status: "NOT_LOGGED",
        to: action.payload.to,
      };
    case actions.EXPIRE_TOKEN:
      return {
        ...state,
        status: "EXPIRED",
      };
    case actions.NOT_EXPIRE_TOKEN:
      return {
        ...state,
        status: "NOT_EXPIRED",
      };
    default:
      return state;
  }
}

import actions from './actions';

const initState: IAuth = { idToken: null, status: 'NOT_LOGGED', to: '/login' };

export default function authReducer(state = initState, action: IAuthAction): IAuth {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        idToken: action.payload?.token ?? null,
        type: action.payload?.type ?? null,
        status: 'NOT_EXPIRED',
        to: action.payload?.type === 1 ? '/admin/employers' : '/admin/withdrawals',
        // type: action.payload.type,
      };

    case actions.LOGOUT:
      return {
        idToken: null,
        status: 'NOT_LOGGED',
        to: action.payload.to,
      };
    case actions.EXPIRE_TOKEN:
      return {
        ...state,
        status: 'EXPIRED',
      };
    case actions.NOT_EXPIRE_TOKEN:
      return {
        ...state,
        status: 'NOT_EXPIRED',
      };
    default:
      return state;
  }
}

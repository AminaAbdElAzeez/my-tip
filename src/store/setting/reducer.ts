// autoAssignReducer.ts

import { AutoAssignAction } from "./action";

const initialState = {
  autoAssignDelivery: false,
};

const autoAssignReducer = (state = initialState, action: AutoAssignAction) => {
  switch (action.type) {
    case "SET_AUTO_ASSIGN_DELIVERY":
      return {
        ...state,
        autoAssignDelivery: action.payload,
      };
    default:
      return state;
  }
};

export default autoAssignReducer;

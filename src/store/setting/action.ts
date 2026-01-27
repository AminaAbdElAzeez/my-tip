// autoAssignActions.ts

const SET_AUTO_ASSIGN_DELIVERY = "SET_AUTO_ASSIGN_DELIVERY";

export const setAutoAssignDelivery = (value: boolean) => ({
  type: SET_AUTO_ASSIGN_DELIVERY,
  payload: value,
});

export type AutoAssignAction = {
  type: typeof SET_AUTO_ASSIGN_DELIVERY;
  payload: boolean;
};

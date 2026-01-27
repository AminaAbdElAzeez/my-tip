const profileActions = {
  FETCH_PROFILE_DATA_START: "FETCH_PROFILE_DATA_START",
  FETCH_PROFILE_DATA_SUCCESS: "FETCH_PROFILE_DATA_SUCCESS",
  FETCH_PROFILE_DATA_FAILURE: "FETCH_PROFILE_DATA_FAILURE",
  SET_PROFILE_DATA: "SET_PROFILE_DATA",
  REMOVE_PROFILE_DATA: "REMOVE_PROFILE_DATA",
  fetchProfileDataStart: () => ({
    type: profileActions.FETCH_PROFILE_DATA_START,
  }),
  fetchProfileDataSuccess: (profile) => ({
    type: profileActions.FETCH_PROFILE_DATA_SUCCESS,
    payload: profile,
  }),
  removeProfileData: () => ({
    type: profileActions.REMOVE_PROFILE_DATA,
    payload: {},
  }),
};

export default profileActions;

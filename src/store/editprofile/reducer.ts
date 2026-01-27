const initialState = {
  name: "",
  email: "",
  password: "",
  loading: false,
  error: null,
};

const EditProfile = (state = initialState, action: any) => {
  switch (action.type) {
    case "FETCH_PROFILE_REQUEST":
    case "UPDATE_PROFILE_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_PROFILE_SUCCESS":
      return { ...state, ...action.payload, loading: false, error: null };

    case "UPDATE_PROFILE_SUCCESS":
      return { ...state, ...action.payload, loading: false, error: null };

    case "FETCH_PROFILE_FAILURE":
    case "UPDATE_PROFILE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export { EditProfile };

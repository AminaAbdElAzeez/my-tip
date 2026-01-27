// import { ThunkAction } from "redux-thunk";
// import { AnyAction } from "redux";
// import axios from "utlis/library/helpers/axios";
// import { notification } from "antd";
// //import { RootState } from "../store";
// import actions from "store/auth/actions";

// export const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
// export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
// export const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";

// export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
// export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
// export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

// // type AppThunk<ReturnType = void> = ThunkAction<
// //   ReturnType,
// //   RootState,
// //   unknown,
// //   AnyAction
// // >;

// export const fetchProfile = (): AppThunk => async (dispatch) => {
//   dispatch({ type: FETCH_PROFILE_REQUEST });
//   try {
//     const token = localStorage.getItem("authToken");
//     const response = await axios.get(
//       "https://backend.outletplus.sa/api/admin/profile",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     dispatch({ type: FETCH_PROFILE_SUCCESS, payload: response.data.data });
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";
//     dispatch({
//       type: FETCH_PROFILE_FAILURE,
//       payload: errorMessage,
//     });
//     // notification.error({
//     //   message: "Error fetching profile",
//     //   description: errorMessage,
//     // });
//   }
// };

// export const updateProfile =
//   (data: { name: string; email: string; password?: string }): AppThunk =>
//   async (dispatch, getState) => {
//     const previousState = getState().EditProfile;
//     dispatch({ type: UPDATE_PROFILE_REQUEST });
//     try {
//       const token = localStorage.getItem("authToken");

//       const requestData = {
//         name: data.name,
//         email: data.email,
//         ...(data.password && { password: data.password }),
//       };

//       const response = await axios.put(
//         "https://backend.outletplus.sa/api/admin/profile",
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: requestData });
//       notification.success({ message: response.data.message });

//       // Perform logout action
//       dispatch(actions.logout("/login"));

//       return response.data;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong";
//       dispatch({ type: UPDATE_PROFILE_FAILURE, payload: errorMessage });

//       dispatch({ type: FETCH_PROFILE_SUCCESS, payload: previousState });

//       // notification.error({
//       //   message: "Error updating profile",
//       //   description: errorMessage,
//       // });
//       throw new Error(errorMessage);
//     }
//   };

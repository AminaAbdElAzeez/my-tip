import axios from "axios";
import { store } from "store/store";
import authAction from "store/auth/actions";
import { useSelector } from "react-redux";

const { setTokenAsExpired } = authAction;

export const URL = "https://mytip-back.appssquare.com";
const { idToken } = store.getState().Auth;

const instance = axios.create({
  baseURL: `${URL}/api`,
});

instance.interceptors.request.use((req) => {
  return req;
});
axios.interceptors.request.use((config) => {
  if (config.url.includes("/api/back/auth/login")) {
    delete config.headers["x-language"];
  }
  return config;
});
delete axios.defaults.headers.common["x-language"];
instance.interceptors.request.use((req) => {
  const { idToken } = store.getState().Auth;
  if (idToken) {
    req.headers.Authorization = `Bearer ${idToken}`;
  }
  return req;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err.response.config, err.response);
    if (err?.response) {
      if (
        err &&
        err.response &&
        err.response.status === 403 &&
        err.response.config.url !== "login"
      ) {
        // window.localStorage.removeItem("mitcvAdminToken");
        // window.location.replace("/");
      } else if (
        err.response.status === 401 &&
        err.response.config.url !== "login"
      ) {
        if (store.getState().Auth.status !== "EXPIRED") {
          store.dispatch(setTokenAsExpired());
        }
        // window.localStorage.removeItem("mitcvAdminToken");
        // window.location.replace("/");
      }

      const customError = {
        ...err,
        message: err.response.data?.message || "An error occurred",
        status: err.response.status,
      };

      return Promise.reject(customError);
    }
    return Promise.reject(err);
  }
);

export default instance;

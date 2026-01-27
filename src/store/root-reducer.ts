import { combineReducers } from "redux";
import App from "store/app/reducer";
import Auth from "store/auth/reducer";

import LanguageSwitcher from "store/languageSwitcher/reducer";
import ThemeSwitcher from "store/themeSwitcher/reducer";
import crumbReducer from "store/crumb/reducer";
import modal from "store/modal/reducer";
import Profile from "store/profile/reducer";

import MapReducer from "store/map/reducer";
import Properties from "store/property/reducer";
import { EditProfile } from "./editprofile/reducer";
import autoAssignReducer from "./setting/reducer";


export default combineReducers({
  Auth,
  App,
  
  LanguageSwitcher,
  MapReducer,
  modal,
  Profile,
  EditProfile,
  crumbReducer,
  ThemeSwitcher,
  autoAssignReducer,
  
  Properties,
});

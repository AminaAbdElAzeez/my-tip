// reducers/userReducer.ts
import { latLng } from "leaflet";
import {
  FETCH_CONTAINERS_REQUEST,
  FETCH_CONTAINERS_SUCCESS,
  FETCH_CONTAINERS_FAILURE,
  FETCH_TECH_USERS,
  FETCH_TECH_CONTAINERS,
  SEARCH_VAL_CHANGED,
  FETCH_MAP_ADDRESS
} from "./actions";

const initialState = {
  loading: false,
  containers: [],
  error: null,
  techUsers: [],
  techContainers: [],
  searchValArr: [],
  mapLatLng: {},
  mapAddress: ""
};

const propertiesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CONTAINERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CONTAINERS_SUCCESS:
      return { ...state, loading: false, containers: action.payload };
    case FETCH_TECH_CONTAINERS:
      return { ...state,loading:false, techContainers: action.payload };
    case FETCH_CONTAINERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_TECH_USERS:
      return { ...state, loading: false, techUsers: action.payload };
    case SEARCH_VAL_CHANGED:
      return { ...state, searchValArr: action.payload };
      case FETCH_MAP_ADDRESS:
      return { ...state, mapAddress: action.payload };
      case "FETCH_CONTAINER_LATLNG":
      return { ...state, mapLatLng: action.payload };
    default:
      return state;
  }
};
export default propertiesReducer;

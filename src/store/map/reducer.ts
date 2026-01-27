

import {
    FETCH_LatLng_SUCCESS,
   
  } from "./actions";
  
  const initialState = {
    
    lat:'',
    lng:'',
    
   
  };
  
  const mapReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case FETCH_LatLng_SUCCESS:
        return {  lat: action.payload.lat, lng: action.payload.lng };
       
      default:
        return state;
    }
  };
  
  export default mapReducer;

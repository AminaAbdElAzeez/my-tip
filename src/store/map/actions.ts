
export const FETCH_LatLng_SUCCESS = 'FETCH_LatLng_SUCCESS';



export const fetchLatLngSuccess = (latLng: {lat:string,lng:string}) => ({
  type: FETCH_LatLng_SUCCESS,
  payload: latLng,
});




// export const fetchBrandsFailure = (error: string) => ({
//   type: FETCH_BRANDS_FAILURE,
//   payload: error,
// });



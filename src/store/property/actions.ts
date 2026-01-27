// actions/userActions.ts
export const FETCH_CONTAINERS_REQUEST = 'FETCH_CONTAINERS_REQUEST';
export const FETCH_CONTAINERS_SUCCESS = 'FETCH_CONTAINERS_SUCCESS';
export const FETCH_TECH_USERS = 'FETCH_TECH_USERS'
export const FETCH_CONTAINERS_FAILURE = 'FETCH_CONTAINERS_FAILURE';
export const REMOVE_USER = 'REMOVE_USER';
export const FETCH_TECH_CONTAINERS = 'FETCH_TECH_CONTAINERS';
export const SEARCH_VAL_CHANGED = 'SEARCH_VAL_CHANGED';
export const FETCH_MAP_ADDRESS = 'FETCH_MAP_ADDRESS'

export const fetchContainersRequest = () => ({ type: FETCH_CONTAINERS_REQUEST });

export const fetchContainersSuccess = (containers: any[]) => ({
  type: FETCH_CONTAINERS_SUCCESS,
  payload: containers,
});
export const fetchContainerLatLng = (latLng: any) => ({
  type: "FETCH_CONTAINER_LATLNG",
  payload: latLng,
});
export const searchValueChangeAction = (dataIndex: any[]) => ({
  type: SEARCH_VAL_CHANGED,
  payload: dataIndex,
});

export const fetchContainersFailure = (error: string) => ({
  type: FETCH_CONTAINERS_FAILURE,
  payload: error,
});
export const fetchTechContainersSuccess = (techContainers: any[]) => ({
  type: FETCH_TECH_CONTAINERS,
  payload: techContainers,
});
export const fetchTechUsersSuccess = (tech: any[]) => ({
  type: FETCH_TECH_USERS,
  payload: tech,
});
export const fetchMapAddress = (address: string) => ({
  type: FETCH_MAP_ADDRESS,
  payload: address,
});

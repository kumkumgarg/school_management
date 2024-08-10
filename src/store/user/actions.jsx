import * as types from './actionTypes';

export const fetchUserRequest = () => ({
  type: types.FETCH_USER_REQUEST
});

export const fetchUserSuccess = (user) => ({
  type: types.FETCH_USER_SUCCESS,
  payload: user
});

export const fetchUserFailure = (error) => ({
  type: types.FETCH_USER_FAILURE,
  payload: error
});

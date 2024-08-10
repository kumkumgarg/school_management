import * as types from './actionTypes';

const initialState = {
  user: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.FETCH_USER_SUCCESS:  
    return {
        ...state,
        loading: false,
        user: action.payload,
        error: null
      };
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;

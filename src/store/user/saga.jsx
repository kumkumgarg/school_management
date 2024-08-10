import { put, takeEvery } from 'redux-saga/effects';
import * as types from './actionTypes';
import UserProvider from '../../providers/UserProvider';

function* fetchUser() {
  try {
    const User = UserProvider();

    // get user details
    const user = yield User.get(); 

    // put user details in redux store
    yield put({ type: types.FETCH_USER_SUCCESS, payload: user });
  } catch (error) {
    yield put({ type: types.FETCH_USER_FAILURE, payload: error });
  }
}

function* userSaga() {
  // action is dispatched to the Store
  yield takeEvery(types.FETCH_USER_REQUEST, fetchUser);
}

export default userSaga;

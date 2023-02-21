import produce from 'immer';

import { UserActionTypes } from '../action/user';

import type { IUserAction } from '../action/user';
import type { IUserState } from '../context/user';

export const userReducer = (state: IUserState, action: IUserAction) => {
  switch (action.type) {
    case UserActionTypes.LIKE_PHOTO_REQUEST:
      return produce(state, (draft) => {
        draft.loading = true;
        draft.error = undefined;
      });
    case UserActionTypes.LIKE_PHOTO_SUCCESS:
      return produce(state, (draft) => {
        draft.photoLikes = [...draft.photoLikes, action.payload];
      });
    case UserActionTypes.UNLIKE_PHOTO_REQUEST:
      return produce(state, (draft) => {
        draft.loading = true;
        draft.error = undefined;
      });
    case UserActionTypes.UNLIKE_PHOTO_SUCCESS:
    case UserActionTypes.FAIL:
    default:
  }
};

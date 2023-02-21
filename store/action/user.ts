import type { Dispatch } from 'react';
import * as Unsplash from '@/types/unsplash';
import { getReasonPhrase } from 'http-status-codes';

export enum UserActionTypes {
  FETCH_DATA_REQUEST = 'USER/FETCH_DATA_REQUEST',
  LIKE_PHOTO_REQUEST = 'USER/LIKE_PHOTO_REQUEST',
  LIKE_PHOTO_SUCCESS = 'USER/LIKE_PHOTO_SUCCESS',
  UNLIKE_PHOTO_REQUEST = 'USER/UNLIKE_PHOTO_REQUEST',
  UNLIKE_PHOTO_SUCCESS = 'USER/UNLIKE_PHOTO_SUCCESS',
  FAIL = 'USER/FAIL',
}

export interface ILikePhotoRequestAction {
  type: UserActionTypes.LIKE_PHOTO_REQUEST;
}

export interface ILikePhotoSuccessAction {
  type: UserActionTypes.LIKE_PHOTO_SUCCESS;
  payload: string;
}

export interface IUnlikePhotoRequestAction {
  type: UserActionTypes.UNLIKE_PHOTO_REQUEST;
}

export interface IUnlikePhotoSuccessAction {
  type: UserActionTypes.UNLIKE_PHOTO_SUCCESS;
  payload: string;
}

export interface IFailAction {
  type: UserActionTypes.FAIL;
  payload: { message: string };
}

export type IUserAction =
  | ILikePhotoRequestAction
  | ILikePhotoSuccessAction
  | IUnlikePhotoRequestAction
  | IUnlikePhotoSuccessAction
  | IFailAction;

export const changePhotoLike = async (
  dispatch: Dispatch<IUserAction>,
  photo: Unsplash.Photo.Basic,
  liked: boolean,
) => {
  try {
    dispatch({
      type: liked
        ? UserActionTypes.LIKE_PHOTO_REQUEST
        : UserActionTypes.UNLIKE_PHOTO_REQUEST,
    });

    const res = await fetch(`${process.env.HOST}/api/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photo, liked }),
    });

    if (res.ok) {
      dispatch({
        type: liked
          ? UserActionTypes.LIKE_PHOTO_SUCCESS
          : UserActionTypes.UNLIKE_PHOTO_SUCCESS,
        payload: photo.id,
      });
    } else {
      dispatch({
        type: UserActionTypes.FAIL,
        payload: { message: getReasonPhrase(res.status) },
      });
    }
  } catch (e) {
    dispatch({
      type: UserActionTypes.FAIL,
      payload: {
        message: e instanceof Error ? e.message : 'Unknown exception occurred',
      },
    });
  }
};

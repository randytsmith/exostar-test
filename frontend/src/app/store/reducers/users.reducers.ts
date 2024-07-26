import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';

import * as UsersActions from '../actions/users.actions';

export interface UserState {
  users: User[];
  loading: boolean;
  message: string;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  message: '',
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    message: '',
  })),
  on(UsersActions.loadUsersSuccess, (state, action) => ({
    ...state,
    loading: false,
    users: [...action.users],
  })),
  on(UsersActions.loadUsersFailure, (state, action) => ({
    ...state,
    loading: false,
    message: action.message,
  }))
);

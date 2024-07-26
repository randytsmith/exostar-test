import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/users.reducers';

export const selectUsersState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUsersState,
  (state: UserState) => state.users
);

export const loadingUsers = createSelector(
  selectUsersState,
  (state: UserState) => state.loading
);

export const usersMessage = createSelector(
  selectUsersState,
  (state: UserState) => state.message
);

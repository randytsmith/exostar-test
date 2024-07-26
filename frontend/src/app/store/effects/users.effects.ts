import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { UsersService } from '../../services/users.service';
import * as UsersActions from '../actions/users.actions';
import { UsersResponseModel } from '../../models/users-response.model';

// load users
export const loadUsers = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap(() =>
        usersService.getUsers().pipe(
          // If success
          map((usersResponse: UsersResponseModel) =>
            UsersActions.loadUsersSuccess({ users: usersResponse.users })
          ),
          //If failure
          catchError((err) =>
            of(
              UsersActions.loadUsersFailure({
                message: err.error?.message,
              })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

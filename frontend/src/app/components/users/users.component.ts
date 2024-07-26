import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import {
  loadingUsers,
  selectUsers,
} from '../../store/selectors/users.selectors';
import { UserState } from '../../store/reducers/users.reducers';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { loadUsers } from '../../store/actions/users.actions';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressBarModule],

  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  loading$: Observable<boolean> = new Observable<boolean>();
  users$: Observable<User[]> = new Observable<User[]>();

  displayedColumns: string[] = ['no', 'name', 'email', 'age'];

  constructor(private store: Store<UserState>) {}

  ngOnInit() {
    this.getUsers();
    this.initialiseAndSubscribeStoreVars();
  }

  initialiseAndSubscribeStoreVars = () => {
    this.loading$ = this.store.pipe(select(loadingUsers));
    this.users$ = this.store.pipe(select(selectUsers));
  };

  getUsers = () => {
    this.store.dispatch(loadUsers());
  };
}

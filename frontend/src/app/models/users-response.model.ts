import { User } from './user.model';

export interface UsersResponseModel {
  status: string;
  message: string;
  users: User[];
}

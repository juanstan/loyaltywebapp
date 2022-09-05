import {User} from '../user';

export class LoginResult {
  user?: User;
  token?: string;
  last_login?: string;
}

import { User } from './user.model';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  token_type?: string;
  user?: User;
}

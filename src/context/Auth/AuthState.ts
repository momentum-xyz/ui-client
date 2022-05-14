import User from '../type/User';

export interface AuthState {
  subject: string;
  user: User | null;
}

export const authDefaultState: AuthState = {
  subject: '',
  user: null
};

// eslint-disable-next-line import/no-cycle
import {Address} from './Address';
import {Profile} from './Profile';

export interface UserSearchResults {
  results: User[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface User {
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
  email: string;
  address?: Address;
  createdAt?: string | number | Date;
  description?: string | null;
  company?: string | null;
  role?: string | null;
  profile: Profile;
}

export default User;

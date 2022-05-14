import {Team} from './Team';
import MeetingSpaceDashboard from './MeetingSpaceDashboard';
// eslint-disable-next-line import/no-cycle
import {Track} from './TrackDashboard';
import {Address} from './Address';
import {Profile} from './Profile';

export enum GraphicSettings {
  low = 'low',
  high = 'high'
}

export interface Members {
  id: string;
}

export interface Groups {
  members: Members[];
}

export interface Challenge {
  id: string;
  name: string;
  tagline: string;
  background: string;
  vision: string;
  impact: string;
  who: string;
  url_video: string;
  url_image: string;
  lifecyclePhase: string;
  groups: Groups[];
  meeting_space: MeetingSpaceDashboard;
}

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

export interface IOnlineUser {
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
  profile: Profile;
}

export interface SpaceMember {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface OldUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  ct_id: number;
  firstName: string;
  lastName: string;
  team_id: number;
  track_id: number;
  phone: string;
  city: string;
  country: string;
  gender: string;
  graphicsSettings: string;
  team: Team;
  role_id?: number;
  my_lead_user_id: number;
  role: string;
  challenge: Challenge;
  track: Track;
  keywords: string;
  organisation: string;
  job_description: string;
  fav_food: string;
  fav_beverage: string;
  bio: string;
  portrait: string;
  portraitFile: File;
  wow_credit: number;
  wows_count: number;
  position?: string;
  url_linkedin?: string;
  url_twitter?: string;
  group_id: string;
  flags: {
    livestream: number;
  };
}

export default User;

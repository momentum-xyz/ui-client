import {Team} from './Team';
// eslint-disable-next-line import/no-cycle
import User, {Challenge} from './User';

export interface Staff {
  leader: User;
  stakeholders: User[];
  jedi: User[];
  delegation: User[];
  jury: User[];
}

export interface Track {
  id: number;
  name: string;
  staff: Staff;
  challenges: Challenge[];
  combinedWowFactor: number;
  combinedEcoSystem: number;
  miro_url?: string;
  trackPosterPath: string;
  badge: string;
}

interface TrackDashboard {
  showMiroboard: boolean;
  selectedChallenge: Challenge | undefined;
  checkbox: boolean;
  track: Track | null;
  teamsInTrack: Team[];
  isLoading: boolean;
}

export default TrackDashboard;

import User from './User';

export enum UserActionTypes {
  wow = 'wow',
  pilot = 'pilot',
  suggestion = 'suggestion'
}

export enum ActivityTypes {
  TEAM_ACTIVITY = 'team_member',
  CHALLENGE_ACTIVITY = 'challenge_member',
  JEDI_TEAM_ACTIVITY = 'jedi_partner',
  JEDI_ACTIVITY = 'jedi',
  DELEGATION_ACTIVITY = 'delegate',
  USER_ACTIVITY = 'user'
}

export interface ActivityFeedProperties {
  id: number;
  user_action_type?: UserActionTypes;
  title: string;
  message: string;
  given_by: User;
  received_by: User;
  date: string;
}

interface Activity {
  checkbox: boolean;
  showCheckbox: boolean;
  checkboxLabels: string[];
  activityType: ActivityTypes | null;
  feed: ActivityFeedProperties[];
  isLoading: boolean;
}

export default Activity;

import {Team} from './Team';
import User from './User';

export interface Wow {
  id: number;
  date: number;
  team: Team;
  user: User;
}

interface Dashboard {
  checkbox: boolean;
  showQuestions: boolean;
  showProvideSuggestion: boolean;
  showTeamUp: boolean;
  showJoinPilot: boolean;
  showWowOverlay: boolean;
  showEcoSystemOverlay: boolean;
  confirmation: {
    show: boolean;
    title: string;
    body: string;
  };
  joinPilotReason: string;
  suggestion: string;
  teamUpReason: string;
  selectedTeam?: Team;
  teams: Team[];
  wowers?: Wow[];
  pilots?: User[];
  miroBoardHeight: number;
  miroBoardWidth: number;
  isLoading: boolean;
}

export enum OwnerType {
  OWNER_TYPE_WORLD = 'OWNER_TYPE_WORLD',
  OWNER_TYPE_PROGRAM = 'OWNER_TYPE_PROGRAM',
  OWNER_TYPE_CHALLENGE = 'OWNER_TYPE_CHALLENGE',
  OWNER_TYPE_PROJECT = 'OWNER_TYPE_PROJECT'
}

export default Dashboard;

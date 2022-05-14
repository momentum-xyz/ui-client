import {Position} from 'react-beautiful-dnd';

import {Project} from './Project';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  position: Position;
  created_at?: Date;
  updated_at?: Date;
  //   program: Program;
  projects: Project[];
  //   community?: Community;
  //   organisation?: Organisation;
}

export interface ChallengeResponse {
  challenge: Challenge;
  admin: boolean;
  status: number;
  message: string;
}

import {Challenge} from './Challange';
import {Position, World} from './World';

export interface Program {
  id?: string;
  name: string;
  description: string;
  position: Position;
  created_at?: Date;
  updated_at?: Date;
  world: World;
  challenges?: Challenge[];
}

export interface ProgramResponse {
  program: Program;
  admin: boolean;
  status: number;
  message: string;
}

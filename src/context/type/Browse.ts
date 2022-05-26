export interface Project {
  name: string;
  description: string;
}

export interface Space {
  name: string;
  children: Space | Project;
}

export interface SpaceResponse {
  programs: Space[];
}

export enum SpaceType {
  WORLD = 'world',
  PROGRAM = 'program',
  CHALLENGE = 'challenge',
  PROJECT = 'project'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  // position: Position;
  // challenge: Challenge;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectResponse {
  project: Project;
  admin: boolean;
  member: boolean;
  status: number;
  message: string;
}

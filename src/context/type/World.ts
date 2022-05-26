export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface World {
  id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  // programs: Program[];
  // organisation: Organisation;
}

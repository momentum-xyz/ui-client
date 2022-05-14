export interface WorldStatItemInterface {
  name: string;
  value: string;
  progress?: number | null;
}

export interface WorldStatInterface {
  title: string;
  items: WorldStatItemInterface[];
}

/** FETCH WORLD STATS **/

export interface WorldStatsRequest {
  spaceId: string;
}

export interface WorldStatsResponse extends WorldStatInterface {}

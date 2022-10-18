/** COMMON **/

export interface VersionInterface {
  major: number;
  minor: number;
  patch: number;
  git?: string;
}

/** FETCH BE VERSION **/

export interface BEVersionRequest {}

export interface BEVersionResponse {
  api: VersionInterface;
  controller: VersionInterface;
}

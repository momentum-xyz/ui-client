/** COMMON **/

export interface VersionInterface {
  major: number;
  minor: number;
  patch: number;
  git?: string;
}

/** FETCH BE VERSION **/

export interface BackendVersionRequest {}

export interface BackendVersionResponse {
  api: VersionInterface;
  controller: VersionInterface;
}

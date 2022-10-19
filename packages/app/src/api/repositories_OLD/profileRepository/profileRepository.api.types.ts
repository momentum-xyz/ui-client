/** UPLOAD AVATAR **/

export interface UploadAvatarRequest {
  avatar: File;
}

export interface UploadAvatarResponse {
  hash: string;
}

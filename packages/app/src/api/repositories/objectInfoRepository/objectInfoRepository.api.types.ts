import {ObjectTransformInterface, ObjectTypeIdEnum, PositionInterface} from '@momentum-xyz/core';

export interface GetObjectInfoRequest {
  objectId: string;
}

export interface GetObjectInfoResponse {
  owner_id: string;
  parent_id: string;
  object_type_id: ObjectTypeIdEnum;
  asset_2d_id: string;
  asset_3d_id: string;
  position: PositionInterface;
  transform: ObjectTransformInterface;
}

export interface PatchObjectInfoRequest {
  objectId: string;
  object_type_id?: string;
  asset_2d_id?: string;
  asset_3d_id?: string;
}

export interface PatchObjectInfoResponse {}

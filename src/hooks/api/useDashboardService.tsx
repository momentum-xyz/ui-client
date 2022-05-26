import {appVariables} from 'api/constants';

import {useFetch, usePost} from './useApi';

export interface Dashboard {
  id: string;
  owner_id: string;
  tiles: Tile[];
}

export interface DashboardDTO {
  id: string;
  owner_id: string;
  tiles: TileDTO[];
}

export enum PermanentType {
  NONE = 'none',
  POSTER = 'poster',
  MEME = 'meme',
  LOGO = 'logo',
  DESCRIPTION = 'description',
  VIDEO = 'video',
  NAME = 'name',
  PROBLEM = 'problem',
  SOLUTION = 'solution'
}

export interface Tile {
  id: string;
  content: any;
  row: number;
  column: number;
  type: TileType;
  render?: number;
  permanentType: PermanentType | null;
  hash?: string;
  internal?: boolean;
  updated_at?: string;
  edited?: boolean;
}

export enum ContentType {
  PROBLEM = 'problem',
  SOLUTION = 'solution',
  DESCRIPTION = 'description',
  NORMAL = 'normal',
  MEME = 'meme',
  POSTER = 'poster'
}

export interface TileDTO {
  id?: string;
  content: any;
  row: number;
  column: number;
  type: TileType;
  permanentType: PermanentType | null;
  render?: number;
  hash?: string;
}

export enum TileType {
  TILE_TYPE_TEXT = 'TILE_TYPE_TEXT',
  TILE_TYPE_MEDIA = 'TILE_TYPE_MEDIA',
  TILE_TYPE_VIDEO = 'TILE_TYPE_VIDEO'
}

export const useDashboard = (id: string) => {
  return useFetch<Dashboard>(appVariables.BACKEND_ENDPOINT_URL + `/dashboard/${id}`, {
    fetchPolicy: 'network-only'
  });
};

export const useUpdateDashboard = () => {
  return usePost<Dashboard, DashboardDTO>(
    appVariables.BACKEND_ENDPOINT_URL + '/dashboard/update-positions',
    {
      cacheKeyGenerator: (data) => appVariables.BACKEND_ENDPOINT_URL + `/${data.owner_id}`
    }
  );
};

export const useDeleteMedia = (spaceId: string | undefined) => {
  return usePost<Tile, Tile | undefined>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/media/${spaceId}/remove`,
    {
      cacheKeyGenerator: (data) => appVariables.BACKEND_ENDPOINT_URL + `/${data.id}`
    }
  );
};

export const useUpdateSpecialTile = () => {
  const updateSpecialTile = (tile: Tile, dashboard: Dashboard) => {
    const isImage = tile.type === TileType.TILE_TYPE_MEDIA;
    console.info(tile, dashboard, isImage);
    // if (isImage) {
    //   const url =
    //     window._env_.BACKEND_ENDPOINT_URL +
    //     `/space/${dashboard.owner_id}/edit/${
    //       tile.permanentType
    //     }`;
    //
    //   const formData = new FormData();
    //   formData.append('file', tile.content.file);
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post(url, formData, requestHeaders)
    //       .then((response) => {
    //         resolve(response.data);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // } else {
    //   let url = '';
    //
    //   url = window._env_.BACKEND_ENDPOINT_URL +
    //     `/${dashboard.owner_id}/edit/${
    //       tile.permanentType
    //     }`;
    //
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post(
    //         url,
    //         {
    //           [tile.permanentType!]: tile.content.text,
    //         },
    //         requestHeaders,
    //       )
    //       .then((response) => {
    //         resolve(response.data);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // }
  };

  return updateSpecialTile;
};

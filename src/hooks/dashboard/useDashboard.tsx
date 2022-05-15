import {useCallback, useEffect, useMemo, useState} from 'react';

import {request} from 'api/request';

import {
  Dashboard,
  Tile,
  TileDTO,
  useUpdateDashboard,
  useUpdateSpecialTile
} from '../api/useDashboardService';

// @ts-ignore
export const useDashboardManager = (dashboard: Dashboard, numberOfColumns, space) => {
  console.info(space);
  const tileMatrix: Tile[][] = useMemo(() => {
    if (!dashboard) {
      return Array.from({length: numberOfColumns}, () => []);
    } else {
      return dashboard.tiles
        .sort((a, b) => a.row - b.row)
        .reduce((carry, item) => {
          if (carry[item.column]) {
            carry[item.column].push(item);
          } else {
            carry[0].push(item);
          }

          return carry;
        }, Array.from({length: numberOfColumns}, () => []) as Tile[][]);
    }
  }, [dashboard, numberOfColumns]);

  const [internalTiles, setInternalTiles] = useState(tileMatrix);

  useEffect(() => setInternalTiles(tileMatrix), [tileMatrix]);

  const updateSpecialTile = useUpdateSpecialTile();
  const [updateDashboard] = useUpdateDashboard();

  // @ts-ignore
  const createOrUpdateDashboard = async (tile: Tile, file, type) => {
    let response;
    let newTile = {...tile};

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const url = `${window._env_.BACKEND_ENDPOINT_URL}/upload`;
      const hashResponse = await request.post(url, formData, {
        headers: {
          'Content-Type': 'image/png'
        }
      });

      newTile = {
        ...tile,
        hash: hashResponse.data
      };
    } else {
      newTile = {
        ...tile
      };
    }

    if (type === 'create') {
      response = await request.post(
        window._env_.BACKEND_ENDPOINT_URL + `/dashboard/create/${dashboard.owner_id}`,
        newTile
      );
    } else {
      response = await request.post(
        window._env_.BACKEND_ENDPOINT_URL + `/dashboard/update/${tile.id}`,
        newTile
      );
    }
    return {response: response, tile: newTile};
  };

  const saveDashboard = useCallback(() => {
    const tilesWithPositions: TileDTO[] = internalTiles
      .map((col, colI) =>
        col.map((t, rowI) => ({
          ...t,
          column: colI,
          row: rowI,
          id: t.internal ? undefined : t.id
        }))
      )
      .flat();

    if (dashboard) {
      // const oldSpecialTiles: Tile[] = dashboard.tiles.reduce(
      //   (carry, tile) => {
      //     if (Object.keys(carry).includes(tile.permanentType))
      //       carry[tile.permanentType] = tile;
      //     return carry;
      //   },
      //   { poster: null, meme: null, description: null, problem: null, solution: null } as {
      //     poster: null | Tile;
      //     meme: null | Tile;
      //     description: null | Tile;
      //     problem: null | Tile;
      //     solution: null | Tile;
      //   },
      // );
      // const newSpecialTiles = tilesWithPositions.reduce(
      //   (carry, tile) => {
      //     // @ts-ignore
      //     if (Object.keys(carry).includes(tile.permanentType))
      //       // @ts-ignore
      //       carry[tile.permanentType] = tile;
      //     return carry;
      //   },
      //   { poster: null, meme: null, description: null, problem: null, solution: null } as {
      //     poster: null | Tile;
      //     meme: null | Tile;
      //     description: null | Tile;
      //     problem: null | Tile;
      //     solution: null | Tile;
      //   },
      // );
      //
      // for (const [key, value] of Object.entries(oldSpecialTiles)) {
      //   if (
      //     newSpecialTiles[key] &&
      //     (!value ||
      //       value?.id !== newSpecialTiles[key].id ||
      //       Date.parse(newSpecialTiles[key].updated_at) >
      //       Date.parse(oldSpecialTiles[key]?.updated_at))
      //   ) {
      //     console.info('updating special tile', newSpecialTiles[key]);
      //     updateSpecialTile(newSpecialTiles[key], dashboard);
      //   } else if (
      //     !newSpecialTiles[key] &&
      //     !!oldSpecialTiles[key] &&
      //     oldSpecialTiles[key].type !== 'TILE_TYPE_MEDIA'
      //   ) {
      //     updateSpecialTile(
      //       {
      //         ...oldSpecialTiles[key],
      //         content: {
      //           ...oldSpecialTiles[key].content,
      //           message: '',
      //         },
      //       },
      //       dashboard,
      //     );
      //   }
      // }

      updateDashboard({
        ...dashboard,
        tiles: tilesWithPositions
      });
    }
  }, [dashboard, internalTiles, updateDashboard, updateSpecialTile]);

  const checkSpecialTiles = (tiles: Tile[][], tile: Tile) => {
    if (tile.permanentType !== null) {
      // eslint-disable-next-line no-param-reassign
      tiles = tiles.map((col) =>
        col.map((iTile) => {
          if (tile.permanentType === iTile.permanentType) {
            return {
              ...iTile,
              content: {
                ...iTile.content,
                type: 'normal'
              }
            };
          } else {
            return iTile;
          }
        })
      );
    }
    return tiles;
  };

  const saveTile = async (tile: Tile, file: File | null, type: string) => {
    const r = await createOrUpdateDashboard(tile, file, type);

    if (r) {
      if (tile.id === 'temp') {
        // setInternalTiles((tiles) => {
        //   let response = tiles.map((inner) => inner.slice());
        //
        //   response = checkSpecialTiles(response, tile);
        //   response[0].push({
        //     ...tile,
        //     id: bytesToUuid(r.response.data.id.data),
        //     hash: r.response.data.hash,
        //     row: r.response.data.row,
        //     column: r.response.data.column
        //   });
        //
        //   return response;
        // });
      } else {
        setInternalTiles((tiles) => {
          // eslint-disable-next-line no-param-reassign
          tiles = checkSpecialTiles(tiles, tile);
          return tiles.map((column) =>
            column.map((inner) => (inner.id === tile.id ? r.tile : inner))
          );
        });
      }
    }
  };

  return {
    saveDashboard,
    internalTiles,
    setInternalTiles,
    saveTile
  };
};

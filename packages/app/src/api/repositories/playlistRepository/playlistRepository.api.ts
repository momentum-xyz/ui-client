import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {BaseRequestInterface, BaseResponseInterface} from './playlistRepository.api.types';
import {playlistRepositoryEndpoints} from './playlistRepository.api.endpoints';

export const fetchPlaylist: RequestInterface<BaseRequestInterface, BaseResponseInterface> = (
  options
) => {
  const {worldId, ...restOptions} = options;
  const url = `${playlistRepositoryEndpoints().base}/${worldId}`;

  return request.get(url, {...restOptions});
};

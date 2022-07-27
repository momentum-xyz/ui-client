import {t} from 'i18next';

import {TileTypeEnum} from 'core/enums';

export const TILES_DROPDOWN_OPTIONS = [
  {
    label: t('dashboard.tileForm.textType'),
    value: TileTypeEnum.TILE_TYPE_TEXT
  },
  {
    label: t('dashboard.tileForm.imageType'),
    value: TileTypeEnum.TILE_TYPE_MEDIA
  },
  {
    label: t('dashboard.tileForm.videoType'),
    value: TileTypeEnum.TILE_TYPE_VIDEO
  }
];

export const YOUTUBE_URL_PLACEHOLDER = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

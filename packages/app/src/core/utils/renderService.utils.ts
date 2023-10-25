import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';

export const getImageAbsoluteUrl = (
  imageUrlOrHash: string | undefined | null,
  size: ImageSizeEnum = ImageSizeEnum.S3
): string | null => {
  const imageServerUrl = `${appVariables.RENDER_SERVICE_URL}/texture/${size}`;
  if (imageUrlOrHash) {
    if (imageUrlOrHash.startsWith('http')) {
      return imageUrlOrHash;
    } else {
      return `${imageServerUrl}/${imageUrlOrHash}`;
    }
  }

  return null;
};

export const getVideoAbsoluteUrl = (videoUrlOrHash: string | undefined | null): string | null => {
  const videoServerUrl = `${appVariables.RENDER_SERVICE_URL}/video`;
  if (videoUrlOrHash) {
    if (videoUrlOrHash.startsWith('http')) {
      return videoUrlOrHash;
    } else {
      return `${videoServerUrl}/${videoUrlOrHash}`;
    }
  }

  return null;
};

export const getTrackAbsoluteUrl = (trackUrlOrHash: string | undefined | null): string | null => {
  const audioServerUrl = `${appVariables.RENDER_SERVICE_URL}/track`;
  if (trackUrlOrHash) {
    if (trackUrlOrHash.startsWith('http')) {
      return trackUrlOrHash;
    } else {
      return `${audioServerUrl}/${trackUrlOrHash}`;
    }
  }

  return null;
};

export const getPluginAbsoluteUrl = (pluginUrlOrHash: string | undefined | null): string | null => {
  const pluginServerUrl = `${appVariables.RENDER_SERVICE_URL}/plugin`;
  // const pluginServerUrl = `http://localhost:4000/api/v4/media/render/plugin`;
  if (pluginUrlOrHash) {
    if (pluginUrlOrHash.startsWith('http')) {
      return pluginUrlOrHash;
    } else {
      return `${pluginServerUrl}/${pluginUrlOrHash}/remoteEntry.js`;
    }
  }

  return null;
};

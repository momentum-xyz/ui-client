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

import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {Asset3dInterface} from 'core/models';
import {appVariables} from 'api/constants';

export const generateImageFromHash = (hash: string | undefined) => {
  // FIXME - temp until proper preview images are available
  return hash
    ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${hash}`
    : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222';
};

export const extractSkyboxAsset3dArrayFromImageHash = (imageHash: {
  [key: string]: string;
}): Asset3dInterface[] => {
  if (!imageHash) {
    return [];
  }
  const skyboxes: Asset3dInterface[] = Object.keys(imageHash)
    .map((name) => {
      const hash = imageHash[name];
      return {
        name,
        id: hash,
        isUserAttribute: true,
        image: generateImageFromHash(hash)
      } as Asset3dInterface;
    })
    .filter((d) => !!d);

  return skyboxes;
};

export const generateImageHashFromSkyboxAsset3dArray = (
  skyboxes: Asset3dInterface[]
): {[key: string]: string} => {
  if (!skyboxes?.length) {
    return {};
  }
  const imageHash = skyboxes.reduce((acc, curr) => ({...acc, [curr.name]: curr.id}), {});
  return imageHash;
};

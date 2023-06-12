export const mediaRepositoryEndpoints = () => {
  const BASE_URL = '/media/upload';

  return {
    uploadImage: `${BASE_URL}/image`,
    uploadVideo: `${BASE_URL}/video`
  };
};

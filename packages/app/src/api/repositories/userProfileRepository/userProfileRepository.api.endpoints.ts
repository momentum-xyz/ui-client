export const userRepositoryEndpoints = () => {
  const BASE_URL = '/profile';

  return {
    base: BASE_URL,
    checkJob: `${BASE_URL}/check-job/:job_id`
  };
};

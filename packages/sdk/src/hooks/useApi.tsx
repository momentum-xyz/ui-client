import {useSpaceGlobalProps} from '../contexts';

export const useSpaceApi = () => {
  const {api} = useSpaceGlobalProps();

  return api;
};

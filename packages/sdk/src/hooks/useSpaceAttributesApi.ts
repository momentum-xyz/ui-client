import {useSpaceGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpaceAttributesApi = () => {
  const {api} = useSpaceGlobalProps();

  return api;
};

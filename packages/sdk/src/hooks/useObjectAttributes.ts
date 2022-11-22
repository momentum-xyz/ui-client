import {useObjectGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useSpaceAttributesApi = () => {
  const {api} = useObjectGlobalProps();

  return api;
};

import {useObjectGlobalProps} from '../contexts/ObjectGlobalPropsContext';

export const useSpaceAttributesApi = () => {
  const {api} = useObjectGlobalProps();

  return api;
};

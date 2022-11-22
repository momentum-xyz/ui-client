import {useObjectGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useObject = () => {
  const {isAdmin, objectId, pluginName, pluginApi, onClose} = useObjectGlobalProps();

  return {
    objectId,
    pluginName,
    isAdmin: isAdmin,
    pluginApi,
    onClose
  };
};

import {useObjectGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useObject = () => {
  const {isAdmin, objectId, pluginName, pluginApi, isExpanded, onClose, onToggleExpand} =
    useObjectGlobalProps();

  return {
    objectId,
    pluginName,
    isAdmin,
    pluginApi,
    isExpanded,
    onClose,
    onToggleExpand
  };
};

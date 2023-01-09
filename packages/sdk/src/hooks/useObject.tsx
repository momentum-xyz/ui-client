import {useObjectGlobalProps} from '../contexts/SpaceGlobalPropsContext';

export const useObject = () => {
  const {isAdmin, objectId, pluginApi, isExpanded, onClose, onToggleExpand} =
    useObjectGlobalProps();

  return {
    objectId,
    isAdmin,
    pluginApi,
    isExpanded,
    onClose,
    onToggleExpand
  };
};

import {useSpaceGlobalProps} from '../contexts';

export const useSpaceTopBar = () => {
  const {renderTopBarActions} = useSpaceGlobalProps();

  return {
    render: renderTopBarActions
  };
};

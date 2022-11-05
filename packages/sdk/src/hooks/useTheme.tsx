import {useSpaceGlobalProps} from '../contexts';

export const useSpaceTheme = () => {
  const {theme} = useSpaceGlobalProps();

  return theme;
};

import {useEffect} from 'react';

import {supernova} from '../animations/supernova/supernova';

export const useSupernova = () => {
  useEffect(() => {
    const reactElement = document.getElementById('reactContainer');
    const animationElement = document.getElementById('wrapper');

    animationElement?.classList.add('birth-of-me-active');
    reactElement?.classList.add('react-birth-of-me-active');

    supernova();

    return () => {
      animationElement?.classList.remove('birth-of-me-active');
      reactElement?.classList.remove('react-birth-of-me-active');
    };
  });
};

import {useContext} from 'react';

import {AuthContext} from '../AuthContext';

const useContextAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContext');
  }
  return context;
};

export default useContextAuth;

import {useContext} from 'react';

import {UnityControlContext} from '../contexts/UnityControlContext';
import {UnityControlInterface} from '../interfaces';

export const useUnityControl = () => useContext<UnityControlInterface>(UnityControlContext);

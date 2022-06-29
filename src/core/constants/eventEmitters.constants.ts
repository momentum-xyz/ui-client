import {EventEmitter} from 'core/utils';
import {UnityEventType} from 'core/types';

export const UnityEventEmitter = new EventEmitter<UnityEventType>();

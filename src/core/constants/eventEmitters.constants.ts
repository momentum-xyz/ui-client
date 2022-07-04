import {EventEmitter} from 'core/utils';
import {PosBusEventType, UnityEventType} from 'core/types';

export const UnityEventEmitter = new EventEmitter<UnityEventType>();
export const PosBusEventEmitter = new EventEmitter<PosBusEventType>();

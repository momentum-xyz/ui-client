import {EventEmitter} from 'core/utils';
import {PosBusEventType} from 'core/types';

export const PosBusEventEmitter = new EventEmitter<PosBusEventType>();

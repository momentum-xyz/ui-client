export type Listener = (...args: any[]) => Promise<any> | void;
export type DefaultEventMap = {[event in string | symbol]: Listener};

export interface IEventEmitter<EventMap extends DefaultEventMap = DefaultEventMap> {
  emit<EventKey extends keyof EventMap>(
    event: EventKey,
    ...args: Parameters<EventMap[EventKey]>
  ): boolean;

  on<EventKey extends keyof EventMap = string>(event: EventKey, listener: EventMap[EventKey]): this;

  once<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  addListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  removeListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  // hasListeners = <EventKey extends keyof EventMap = string>(event: EventKey) => {
  //     return this.emitter.listenerCount(event as string) !== 0;
  // };
  prependListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  prependOnceListener<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  off<EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this;

  removeAllListeners<EventKey extends keyof EventMap = string>(event?: EventKey): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners<EventKey extends keyof EventMap = string>(event: EventKey): EventMap[EventKey][];
  rawListeners<EventKey extends keyof EventMap = string>(event: EventKey): EventMap[EventKey][];
  eventNames(): Array<string | symbol>;
  listenerCount<EventKey extends keyof EventMap = string>(type: EventKey): number;
}

/** cast type of any event emitter to typed event emitter */
export function asTypedEventEmitter<
  EventMap extends DefaultEventMap,
  X extends NodeJS.EventEmitter
>(x: X): IEventEmitter<EventMap> {
  return x as any;
}

/** Implemented event emitter */
export class EventEmitter<EventMap extends DefaultEventMap = DefaultEventMap>
  implements IEventEmitter<EventMap>
{
  events: {
    [eventName in keyof EventMap]: Listener[];
  } = {} as {
    [eventName in keyof EventMap]: Listener[];
  };

  maxListeners = Infinity;

  emit = <EventKey extends keyof EventMap>(
    event: EventKey,
    ...args: Parameters<EventMap[EventKey]>
  ) => {
    if (this.events[event]) {
      const len = this.events[event].length;
      for (const e of this.events[event]) {e(...args);}
      return !!len;
    }
    return false;
  };

  on = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    this.addListener(event, listener);
    return this;
  };

  once = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;
    this.addListener(event, onceListener);
    return this;
  };

  addListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (!(event in this.events)) {this.events[event] = [listener];}
    else {this.events[event].push(listener);}
    if (this.maxListeners !== Infinity && this.maxListeners <= this.events[event].length)
      {console.warn(`Maximum event listeners for "${event as string}" event!`);}
    return this;
  };

  removeListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (event in this.events) {
      const i = this.events[event].indexOf(listener);
      if (i !== -1) {this.events[event].splice(i, 1);}
    }
    return this;
  };

  hasListeners = <EventKey extends keyof EventMap = string>(event: EventKey) => {
    return this.events[event] && !!this.events[event].length;
  };

  prependListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    if (!(event in this.events)) {this.events[event] = [listener];}
    else {this.events[event].unshift(listener);}
    return this;
  };

  prependOnceListener = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    const onceListener = ((...args: any) => {
      listener(...args);
      this.removeListener(event, onceListener);
    }) as any;
    this.prependListener(event, onceListener);
    return this;
  };

  off = <EventKey extends keyof EventMap = string>(
    event: EventKey,
    listener: EventMap[EventKey]
  ): this => {
    return this.removeListener(event, listener);
  };

  removeAllListeners = <EventKey extends keyof EventMap = string>(event?: EventKey): this => {
    if (event) {delete this.events[event];}
    return this;
  };

  setMaxListeners = (n: number): this => {
    this.maxListeners = n;
    return this;
  };

  getMaxListeners = (): number => {
    return this.maxListeners;
  };

  listeners = <EventKey extends keyof EventMap = string>(event: EventKey): EventMap[EventKey][] => {
    return [...this.events[event]] as any[];
  };

  rawListeners = <EventKey extends keyof EventMap = string>(
    event: EventKey
  ): EventMap[EventKey][] => {
    return this.events[event] as any[];
  };

  eventNames = (): Array<string | symbol> => {
    return Object.keys(this.events);
  };

  listenerCount = <EventKey extends keyof EventMap = string>(type: EventKey): number => {
    return (this.events[type] && Object.keys(this.events[type]).length) || 0;
  };
}

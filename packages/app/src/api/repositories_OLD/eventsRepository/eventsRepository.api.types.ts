/** Base **/
export interface EventInterface {
  id: string;
  title: string;
  description: string;
  hosted_by: string;
  image_hash?: string;
  web_link?: string;
  spaceId: string;
  spaceName: string;
  start: string;
  end: string;
  created: string;
  modified: string;
  space_integration: {
    type: string;
    data: Buffer;
  };
}

export interface EventFormInterface {
  start: Date;
  end: Date;
  title: string;
  hosted_by: string;
  web_link: string | null;
  description: string;
  image?: File;
}

export interface BaseEventsRequest {
  spaceId: string;
  children?: boolean;
}

/** FETCH EVENTS **/
export interface FetchEventsResponse extends Array<EventInterface> {}

/** FETCH EVENT **/
export interface FetchEventRequest extends BaseEventsRequest {
  eventId: string;
}

export interface FetchEventResponse extends Event {
  eventId: string;
}

/** CREATE EVENT **/
export interface CreateEventRequest extends BaseEventsRequest {
  data: EventFormInterface;
}

export interface CreateEventResponse {
  id: string;
}

/** UPDATE EVENT **/
export interface UpdateEventRequest extends BaseEventsRequest {
  eventId: string;
  data: EventFormInterface;
}

export interface UpdateEventResponse {}

/** DELETE EVENT **/
export interface DeleteEventRequest extends BaseEventsRequest {
  eventId: string;
}

export interface DeleteEventResponse {}

/** IMAGE UPLOAD **/
export interface UploadFileRequest extends BaseEventsRequest {
  file: File;
  eventId: string;
}

export interface UploadFileResponse {}

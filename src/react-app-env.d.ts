/// <reference types="react-scripts" />

module 'react-add-to-calendar-hoc' {
  import React, {FC} from 'react';

  export interface EventCalendarInterface {
    description: string;
    duration: number;
    endDatetime: string;
    startDatetime: string;
    title: string;
    location?: string;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export enum SHARE_SITES {
    GOOGLE = 'Google',
    ICAL = 'iCal',
    OUTLOOK = 'Outlook',
    YAHOO = 'Yahoo'
  }

  export interface AddToCalendarPropsInterface {
    buttonProps?: object;
    buttonText?: string;
    className?: string;
    dropdownProps?: object;
    event?: CalendarEventInterface;
    items?: SHARE_SITES[];
    linkProps?: object;
    // @ts-ignore: refactoring
    onRequestClose?: (event) => void;
  }

  const AddToCalendar: FC<AddToCalendarPropsInterface>;

  const AddToCalendarHOC: (
    button: React.ReactNode,
    component: React.ReactNode
  ) => typeof AddToCalendar;

  export default AddToCalendarHOC;
}

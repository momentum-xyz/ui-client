import {format} from 'date-fns-tz';

export const formatStartDate = (date: Date) => {
  return format(date, 'iii, MMM d ', {
    timeZone: 'Europe/Berlin'
  }).toUpperCase();
};

export const formatStartTime = (date: Date) => {
  return format(date, '- h:mm aa', {
    timeZone: 'Europe/Berlin'
  }).toUpperCase();
};

export const formatEndDate = (date: Date) => {
  return format(date, 'MMM d h:mm aa z', {
    timeZone: 'Europe/Berlin'
  }).toUpperCase();
};

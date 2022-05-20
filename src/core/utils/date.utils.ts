/*
 * Returns date as string in YYYYMMDDTHHmmss format
 */
import {format} from 'date-fns-tz';

export const formattedStringFromDate = (date: Date) => {
  return date.toISOString().replace(/:|-/g, '').split('.')[0] + 'Z';
};

export const durationInMilliseconds = (start: Date, end: Date) => {
  return end.getTime() - start.getTime();
};

export const durationInSeconds = (start: Date, end: Date) => {
  return durationInMilliseconds(start, end) / 1000;
};

export const durationInMinutes = (start: Date, end: Date) => {
  return durationInSeconds(start, end) / 60;
};

export const durationInHours = (start: Date, end: Date) => {
  return durationInMinutes(start, end) / 60;
};

export const fullTimePart = (timePart: number) => {
  return timePart.toString().padStart(2, '0');
};

export const timeRangeString = (start: Date, end: Date) => {
  return `${start.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })} - ${end.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  })}`;
};

export const getTimezone = (date: Date) => {
  const textual = date.toLocaleString('en-US', {
    timeZoneName: 'short'
  });

  const timeParts = textual.split(' ');
  return timeParts[timeParts.length - 1];
};

export const timeFromNow = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);

  return date;
};

export const monthAndYearString = (date: Date) => {
  const today = new Date();
  const options = {year: 'numeric', month: 'short'} as const;
  return today.toLocaleDateString('en-US', options);
};

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

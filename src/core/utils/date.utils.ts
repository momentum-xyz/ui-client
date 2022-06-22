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
  const today = new Date(date);
  const options = {year: 'numeric', month: 'short'} as const;
  return today.toLocaleDateString('en-US', options);
};

export const isOtherYearThanToday = (date: Date) => {
  const today = new Date();

  return today.getFullYear() !== date.getFullYear();
};

export const formatStartDate = (date: Date, showYear = false) => {
  return format(date, `iii, MMM d ${showYear ? 'yyyy ' : ''}`);
};

export const formatStartTime = (date: Date) => {
  return format(date, '- h:mm aa');
};

export const formatEndDate = (date: Date, showYear = false) => {
  return format(date, `MMM d${showYear ? ' yyyy' : ''} h:mm aa zzz`);
};

export const formatDurationTime = (seconds: number) => {
  const floored = Math.floor(seconds);

  return new Date(floored * 1000).toISOString().match(/(?<=\d\d:)\d\d:\d\d/)?.[0];
};

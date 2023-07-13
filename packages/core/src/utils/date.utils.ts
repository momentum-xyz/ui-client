import {format} from 'date-fns-tz';
import {addMinutes} from 'date-fns';

/**
 * Converts date to string in "YYYYMMDDTHHmmssZ" format
 *
 * @param {Date} date The date to convert
 * @returns {string} The date converted to ISO string in "YYYYMMDDTHHmmssZ" format
 */
export const formattedStringFromDate = (date: Date) => {
  return date.toISOString().replace(/:|-/g, '').split('.')[0] + 'Z';
};

/**
 * Calculates the duration in ms
 *
 * @param {Date} start Start date
 * @param {Date} end End date
 * @returns {number} Duration in ms between start and end date
 */
export const durationInMilliseconds = (start: Date, end: Date) => {
  return end.getTime() - start.getTime();
};

/**
 * Calculates the duration in seconds
 *
 * @param {Date} start Start date
 * @param {Date} end End date
 * @returns {number} Duration in seconds between start and end date
 */
export const durationInSeconds = (start: Date, end: Date) => {
  return durationInMilliseconds(start, end) / 1000;
};

/**
 * Calculates the duration in minutes
 *
 * @param {Date} start Start date
 * @param {Date} end End date
 * @returns {number} Duration in minutes between start and end date
 */
export const durationInMinutes = (start: Date, end: Date) => {
  return durationInSeconds(start, end) / 60;
};

/**
 * Calculates the duration in hours
 *
 * @param {Date} start Start date
 * @param {Date} end End date
 * @returns {number} Duration in hours between start and end date
 */
export const durationInHours = (start: Date, end: Date) => {
  return durationInMinutes(start, end) / 60;
};

/**
 * Converts part of time (hours,minutes, seconds, etc.) into a 2 digit string number padded with 0's
 *
 * @param {number} timePart part of the time in values 0-60
 * @returns {string} Padded 2-digit string representation of a number
 */
export const fullTimePart = (timePart: number) => {
  return timePart.toString().padStart(2, '0');
};

/**
 * Constructs a time range string
 *
 * @param {Date} start start date
 * @param {Date} end end date
 * @returns {string} time range string in "HH:MM aa - HH:MM aa Z" format
 */
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

/**
 * Returns time zone
 *
 * @param {Date} date Date for the timezone to be extrated from
 * @returns {string} short string representation of time zone
 */
export const getTimezone = (date: Date) => {
  const textual = date.toLocaleString('en-US', {
    timeZoneName: 'short'
  });

  const timeParts = textual.split(' ');
  return timeParts[timeParts.length - 1];
};

/**
 * Calculates date from now in specified hours
 *
 * @param {number} hours number of hours
 * @returns {Date} Date hours from now
 */
export const timeFromNow = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);

  return date;
};

/**
 * Constructs locale string containing only month and year
 *
 * @param {Date} date Date to convert to string
 * @returns {string} String containing month and the year in "MM YYYY" format
 */
export const monthAndYearString = (date: Date) => {
  const today = new Date(date);
  const options = {year: 'numeric', month: 'short'} as const;
  return today.toLocaleDateString('en-US', options);
};

/**
 * Utility that checks wether a specified date is within teh current year
 *
 * @param {Date} date The year to check
 * @returns {boolean} Boolean which indicates wether the provided date fitis within todays year
 */
export const isOtherYearThanToday = (date: Date) => {
  const today = new Date();

  return today.getFullYear() !== date.getFullYear();
};

/**
 * Formats date to a string in "iii, MMM d" or "iii, MMM d yyyy" format
 *
 * @param {Date} date Date to format
 * @param {boolean} showYear Should the output string contain year
 * @returns {string} string represetntation of date in "iii, MMM d yyyy" if `showYear === true` or "iii, MMM d" otherwise
 */
export const formatStartDate = (date: Date, showYear = false) => {
  return format(date, `iiii, MMM d ${showYear ? 'yyyy ' : ''}`);
};

/**
 * Formats date to a string in "- h:mm aa" format
 *
 * @param {Date} date Date to format
 * @returns {string} string represetntation of date in "- h:mm aa"
 */
export const formatStartTime = (date: Date) => {
  return format(date, '- h:mm aa');
};

/**
 * Formats date to a string in "MMM d yyyy h:mm aa zzz" or "MMM d h:mm aa zzz" format
 *
 * @param {Date} date Date to format
 * @param {boolean} showYear Should the output string contain year
 * @returns {string} string represetntation of date in "MMM d yyyy h:mm aa zzz" if `showYear === true` or "MMM d h:mm aa zzz" otherwise
 */
export const formatEndDate = (date: Date, showYear = false) => {
  return format(date, `MMM d${showYear ? ' yyyy' : ''} - h:mm aa zzz`);
};

/**
 * Formats time duration in a "mm:ss" fomat
 *
 * @param {number} seconds Time in seconds of duration
 * @returns {string} String representation of duration in "mm:ss" format
 */
export const formatDurationTime = (seconds: number) => {
  const initialDate = new Date(seconds * 1000);
  const targetDate = addMinutes(initialDate, initialDate.getTimezoneOffset());
  return format(targetDate, 'mm:ss');
};

/**
 * Formats a date to strng with only hours and minutes in "HH:mm" format
 *
 * @param {Date} date Date to format
 * @returns {string} Date in "HH:mm" format
 */
export const dateToTime = (date: Date) => {
  return format(date, `HH:mm`);
};

/**
 * Constructs locale string containing only month and year
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String containing month and the year in "MM YYYY" format
 */
export const registrationDateString = (dateISO: string | undefined | null) => {
  return dateISO ? format(new Date(dateISO), 'MMMM yyyy') : '';
};

/**
 * Constructs locale string for newsfeed
 *
 * @param {string} dateISO is ISO string or empty
 * @param {string} hasDash is used as separator between date and time parts
 * @returns {string} String in "31/01/2023 - 2:31 PM" format
 */
export const newsfeedDateString = (dateISO: string | undefined | null, hasDash: boolean) => {
  const targetFormat = hasDash ? 'MM/dd/yyyy - h:mm aa' : 'MM/dd/yyyy h:mm aa';
  return dateISO ? format(new Date(dateISO), targetFormat) : '';
};

/**
 * Constructs locale string for timeline
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String in "2023 - 01 - 16 / 09:00 PM" format
 */
export const timelineDate = (dateISO: string | undefined | null) => {
  const targetFormat = 'yyyy - MM - dd / hh:mm aa';
  return dateISO ? format(new Date(dateISO), targetFormat) : '';
};

/**
 * Constructs locale string containing only month and year
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String containing month and the year in "MMMM YYYY" format
 */
export const signUpDateString = (dateISO: string | undefined | null) => {
  return dateISO ? format(new Date(dateISO), 'MMMM yyyy') : '';
};

/**
 * Constructs locale string for time
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String in "09:00 PM" format
 */
export const getTime = (dateISO: string | undefined | null) => {
  const targetFormat = 'hh:mm aa';
  return dateISO ? format(new Date(dateISO), targetFormat) : '';
};

/**
 * Constructs locale string for time
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String in "Monday 01 January" format
 */
export const getDayWithMonth = (dateISO: string | undefined | null) => {
  const targetFormat = 'EEEE dd MMMM';
  return dateISO ? format(new Date(dateISO), targetFormat) : '';
};

/**
 * Constructs locale string
 *
 * @param {string} dateISO is ISO string or empty
 * @returns {string} String in "2023-01-16" format
 */
export const dateWithoutTime = (dateISO: string | undefined | null) => {
  const targetFormat = 'yyyy-MM-dd';
  return dateISO ? format(new Date(dateISO), targetFormat) : '';
};

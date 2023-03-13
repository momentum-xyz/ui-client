import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError} from 'axios';

import {appVariables, httpErrorCodes} from 'api/constants';

const TOKEN_TYPE = 'Bearer';
const TOKEN_KEY = 'odyssey.token';
const REQUEST_TIMEOUT_MS = 120_000;
export const REQUEST_MAX_RETRIES = 3;
export const REQUEST_RETRY_DELAY_BASE = 1000;

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
};

/**
 * Create a new Axios instance with a custom config.
 */
const request: AxiosInstance = axios.create({
  responseType: 'json',
  headers: defaultHeaders,
  timeout: REQUEST_TIMEOUT_MS
});

/**
 * Create request, response & error handlers
 */
const requestHandler = (requestConfig: AxiosRequestConfig & {authToken?: string}) => {
  requestConfig.baseURL = `${appVariables.BACKEND_API_URL}`;
  if (requestConfig.authToken && requestConfig.headers) {
    /** set authToken provided by the app */
    requestConfig.headers.Authorization = `${TOKEN_TYPE} ${requestConfig.authToken}`;
  }
  return requestConfig;
};

const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  throw error;
};

/**
 * Configure actual token
 */
const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAccessToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

/**
 * Configure interceptors from Axios
 */
request.interceptors.request.use(requestHandler, errorHandler);

type AxiosRequestConfigWithRetryType = AxiosRequestConfig & {momentumRetryCount?: number};

export const setApiResponseHandlers = ({
  onResponse = responseHandler,
  onError = errorHandler,
  maxRetries = REQUEST_MAX_RETRIES,
  retryDelayBase = REQUEST_RETRY_DELAY_BASE,
  retryCodes = [httpErrorCodes.MAINTENANCE]
}) => {
  request.interceptors.response.use(onResponse, (error) => {
    const status = error.response?.status;

    const config = error.config as AxiosRequestConfigWithRetryType;

    console.error('API Error:', {error, status, request: error.request, config});
    if (status && retryCodes.includes(status)) {
      // retry
      const {momentumRetryCount: count = 0} = config || {momentumRetryCount: maxRetries};
      if (count < maxRetries) {
        return new Promise((resolve) => {
          console.log('Retrying request', {count, error});
          const newConfig: AxiosRequestConfigWithRetryType = {
            ...config,
            momentumRetryCount: count + 1
          };
          setTimeout(() => {
            resolve(request(newConfig));
          }, retryDelayBase * count);
        });
      }
    }

    return onError(error);
  });
};

export const refreshAxiosToken = (token: string) => {
  setAccessToken(token);
  request.interceptors.request.use((config) => {
    if (config.headers) {
      config.headers.Authorization = `${TOKEN_TYPE} ${getAccessToken()}`;
    }
    return config;
  });
};

/**
 * Export the newly created Axios instance to be used in different locations
 */
export {request};

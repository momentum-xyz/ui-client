import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError} from 'axios';

const TOKEN_TYPE = 'Bearer';
const TOKEN_KEY = 'token.momentum';
const REQUEST_TIMEOUT_MS = 10_000;

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
};

/**
 * Create a new Axios instance with a custom config.
 */
const request: AxiosInstance = axios.create({
  baseURL: '',
  responseType: 'json',
  headers: defaultHeaders,
  timeout: REQUEST_TIMEOUT_MS
});

/**
 * Create request, response & error handlers
 */
const requestHandler = (requestConfig: AxiosRequestConfig & {authToken?: string}) => {
  if (requestConfig.authToken) {
    /** set authToken provided by the app */
    requestConfig.headers.Authorization = `${TOKEN_TYPE} ${requestConfig.authToken}`;
  }
  return requestConfig;
};

const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  return Promise.reject(error) as unknown;
};

/**
 * Configure actual token
 */
const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getAccessToken = (): string => {
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
  maxRetries = 3,
  retryDelayBase = 1000,
  retryCodes = [503]
}) => {
  console.log('setApiResponseHandlers', {
    onResponse,
    onError,
    maxRetries,
    retryDelayBase,
    retryCodes
  });

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
    config.headers.Authorization = `${TOKEN_TYPE} ${getAccessToken()}`;
    return config;
  });
};

/**
 * Export the newly created Axios instance to be used in different locations
 */
export {request};

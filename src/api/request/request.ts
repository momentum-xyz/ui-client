import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {AuthContextProps} from 'react-oidc-context';

const TOKEN_TYPE = 'Bearer';
const TOKEN_KEY = 'token.momentum';
const REQUEST_TIMEOUT_MS = 10_000;

const REFRESH_OPTIONS = {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true
};

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
  throw error;
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

request.interceptors.response.use(responseHandler, errorHandler);

export const extendAxiosInterceptors = (token: string) => {
  setAccessToken(token);
  request.interceptors.request.use((config) => {
    config.headers.Authorization = `${TOKEN_TYPE} ${getAccessToken()}`;
    return config;
  });
};

export const refreshAxiosInterceptors = (
  authProps: AuthContextProps,
  callback?: (token: string) => void,
  errorCallback?: () => void
) => {
  // @ts-ignore: strange types
  const refreshAuthLogic = (failedRequest) =>
    authProps
      .signinSilent()
      .then((user) => {
        if (user?.access_token) {
          setAccessToken(user.access_token);
          failedRequest.response.config.headers.Authorization = `${TOKEN_TYPE} ${user.access_token}`;
          if (callback) {
            callback(user.access_token);
          }
        } else if (errorCallback) {
          errorCallback();
        }
        return Promise.resolve();
      })
      .catch(() => {
        if (errorCallback) {
          errorCallback();
        }
      });

  createAuthRefreshInterceptor(request, refreshAuthLogic, {...REFRESH_OPTIONS});
};

/**
 * Export the newly created Axios instance to be used in different locations
 */
export {request};

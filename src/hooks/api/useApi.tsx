import {AxiosRequestConfig} from 'axios';
import {useCallback, useEffect, useRef, useState} from 'react';

import {request} from 'api/request';

interface IApiCache {
  [key: string]: {
    data: any;
    lastFetch: Date;
  };
}

const apiCache: IApiCache = {};
export interface UseApiOptionsProps {
  fetchPolicy?: 'network-only' | 'cache-first' | 'cache-and-network' | 'cache-only';
  lazy?: boolean;
  ready?: boolean;
}

const DefaultOptions: UseApiOptionsProps = {
  fetchPolicy: 'cache-first',
  lazy: false,
  ready: true
};

/**
 * Fetch and cache data from given url and manage relevant information.
 *
 * This hook fetches data from an url or the cach or a combination of both.
 * The fetch behavior is defiend bij the:
 * @param options.fetchPolicy "network-only" | "cache-first" | "cache-and-network" | "cache-only"
 * @param options.lazy determines if the data field wil be cleared before refetching data
 * @param options.ready only when ready becomes true, the request wil be initiated. This can be helpfull for dependant requests
 */
export const useFetch = <T,>(url: string, options?: UseApiOptionsProps) => {
  // eslint-disable-next-line no-param-reassign
  options = {...DefaultOptions, ...options};
  const {fetchPolicy, lazy, ready} = options;
  const isInCache = apiCache.hasOwnProperty(url);
  const useCache = fetchPolicy !== 'network-only';
  const useNetwork =
    fetchPolicy === 'network-only' ||
    fetchPolicy === 'cache-and-network' ||
    (fetchPolicy === 'cache-first' && !isInCache);

  const [data, setData] = useState<T | undefined>(
    isInCache && useCache ? apiCache[url].data : undefined
  );
  const [loading, setLoading] = useState(!(isInCache && useCache));
  const [error, setError] = useState<Error | null>(null);

  const cancelCurrentRequest = useRef(() => {});

  const fetchFromNetwork = useCallback(() => {
    let canceld = false;

    request
      .get(url)
      .then((response) => {
        apiCache[url] = {
          data: response.data,
          lastFetch: new Date()
        };
        if (!canceld) {
          setLoading(false);
          setData(response.data as T);
        }
      })
      .catch((e) => {
        if (!canceld) {
          setData(undefined);
          setLoading(false);
          setError(e);
        }
      });

    return () => {
      canceld = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const refetch = useCallback(
    (silent = true) => {
      cancelCurrentRequest.current();
      setLoading((load) => load || !silent);
      cancelCurrentRequest.current = fetchFromNetwork();
    },
    [fetchFromNetwork]
  );

  useEffect(() => {
    if (!ready) return;
    setData((prev) => (isInCache && useCache ? apiCache[url].data : lazy ? prev : undefined));
    setLoading(!(isInCache && useCache));
    setError(null);
    if (useNetwork) {
      if (!useCache) setLoading(true);
      cancelCurrentRequest.current = fetchFromNetwork();
    }
    return () => {
      cancelCurrentRequest.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ready, fetchFromNetwork]);

  const response: [T | undefined, boolean, Error | null, () => void] = [
    data,
    loading,
    error,
    refetch
  ];

  return response;
};

export const promiseFetch = async <T,>(
  url: string,
  headers?: AxiosRequestConfig,
  fetchPolicy: 'network-only' | 'cache-first' | 'cache-and-network' | 'cache-only' = 'cache-first'
) => {
  const isInCache = apiCache.hasOwnProperty(url);
  const useCache = fetchPolicy !== 'network-only';

  if (useCache && isInCache) return apiCache[url].data as T;

  const response = await request.get(url, headers);

  apiCache[url] = {
    data: response.data,
    lastFetch: new Date()
  };

  return response.data as T;
};

interface UsePostOptionsProps<T = any> {
  lazy?: boolean;
  cacheKeyGenerator?: (data: T) => string;
}

const PostDefaultOptions: UsePostOptionsProps = {
  lazy: true
};

export const usePost = <T, R = any>(url: string, options?: UsePostOptionsProps<T>) => {
  // eslint-disable-next-line no-param-reassign
  options = {...PostDefaultOptions, ...options};
  const {lazy, cacheKeyGenerator} = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postRequest = useCallback(
    (data) => {
      setLoading(true);
      if (!lazy) setData(undefined);
      return new Promise<T>((resolve, reject) => {
        request
          .post(url, data)
          .then((response) => {
            setLoading(false);
            setData(response.data);
            if (cacheKeyGenerator) {
              const cachKey = cacheKeyGenerator(response.data);
              console.info('pull sucess updating cache by generator: ', cachKey);
              apiCache[cachKey] = {
                data: response.data,
                lastFetch: new Date()
              };
            }
            resolve(response.data);
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            reject(error);
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lazy, url]
  );

  const response: [(data: R) => Promise<T>, T | undefined, boolean, Error | null] = [
    postRequest,
    data,
    loading,
    error
  ];

  return response;
};

interface UsePutOptionsProps<T = any> {
  lazy?: boolean;
  cacheKeyGenerator?: (data: T) => string;
}

const PutDefaultOptions: UsePostOptionsProps = {
  lazy: true
};
export const usePut = <T, R = any>(url: string, options?: UsePutOptionsProps<T>) => {
  // eslint-disable-next-line no-param-reassign
  options = {...PutDefaultOptions, ...options};
  const {lazy, cacheKeyGenerator} = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const putRequest = useCallback(
    (data) => {
      setLoading(true);
      if (!lazy) setData(undefined);
      return new Promise<T>((resolve, reject) => {
        request
          .put(url, data)
          .then((response) => {
            setLoading(false);
            setData(response.data);
            if (cacheKeyGenerator) {
              const cachKey = cacheKeyGenerator(response.data);
              console.info('pull sucess updating cache by generator: ', cachKey);
              apiCache[cachKey] = {
                data: response.data,
                lastFetch: new Date()
              };
            }
            resolve(response.data);
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            reject(error);
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lazy, url]
  );

  const response: [(data: R) => Promise<T>, T | undefined, boolean, Error | null] = [
    putRequest,
    data,
    loading,
    error
  ];

  return response;
};

export const useDelete = <T, R = any>(url: string, options?) => {
  // eslint-disable-next-line no-param-reassign
  options = {...options};
  const {lazy, cacheKeyGenerator} = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRequest = useCallback(
    () => {
      setLoading(true);
      return new Promise<T>((resolve, reject) => {
        request
          .delete(url)
          .then((response) => {
            setLoading(false);
            setData(response.data);
            if (cacheKeyGenerator) {
              const cachKey = cacheKeyGenerator(response.data);
              console.info('pull sucess updating cache by generator: ', cachKey);
              apiCache[cachKey] = {
                data: response.data,
                lastFetch: new Date()
              };
            }
            resolve(response.data);
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            reject(error);
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lazy, url]
  );

  const response: [(data: R) => Promise<T>, T | undefined, boolean, Error | null] = [
    deleteRequest,
    data,
    loading,
    error
  ];

  return response;
};

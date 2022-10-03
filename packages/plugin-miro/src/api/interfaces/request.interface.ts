import {AxiosResponse, AxiosRequestConfig, AxiosInstance} from 'axios';

export interface RequestInterface<P, R> {
  (request: AxiosInstance, params: (P | null) & Partial<AxiosRequestConfig>): Promise<
    AxiosResponse<R>
  >;
}

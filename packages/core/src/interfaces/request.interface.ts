import {AxiosResponse, AxiosRequestConfig, AxiosInstance} from 'axios';

export interface RequestInterface<P, R> {
  (params: (P | null) & Partial<AxiosRequestConfig>, request?: AxiosInstance): Promise<
    AxiosResponse<R>
  >;
}

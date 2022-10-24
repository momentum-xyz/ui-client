import {AxiosResponse, AxiosRequestConfig} from 'axios';

export interface RequestInterface<P, R> {
  (params: (P | null) & Partial<AxiosRequestConfig>): Promise<AxiosResponse<R>>;
}

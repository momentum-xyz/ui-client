import {types, flow} from 'mobx-state-tree';
import axios, {
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosError,
  AxiosResponse,
  AxiosInstance
} from 'axios';
import {RequestStateEnum} from 'core/enums';

const UNAUTHORIZED_STATUS = 401;
const BAD_FIELD_STATUS = 400;

/**
 * This is utility model that responsible for:
 *
 * - fetching data
 * - showing errors
 * - keeping a request state
 * - adding auth details to every request
 * - handling auth errors
 */
const RequestModel = types
  .model('Request', {
    showError: false,
    isCancellable: true,
    state: types.maybeNull(types.enumeration(Object.values(RequestStateEnum)))
  })
  .actions((self) => {
    let cancel: CancelTokenSource | null = null;
    // @ts-ignore: MST-actions
    const actions = {
      send: flow(function* send<T, R extends {data: unknown; config: AxiosRequestConfig}>(
        action: (request: AxiosInstance, options: T) => Promise<R>,
        request: AxiosInstance,
        options: T
      ) {
        try {
          self.state = RequestStateEnum.Pending;

          if (self.isCancellable) {
            if (cancel) {
              actions.cancel(
                'Request cancelled: the same api call is being called multiple times subsequently'
              );
            }
            cancel = axios.CancelToken.source();
          }

          const response: AxiosResponse<R> = yield action(request, {
            ...options,
            ...(self.isCancellable ? {cancelToken: cancel?.token} : {}),
            headers: {
              // additional headers if it needs
            }
          });

          console.assert(!!response, 'Got empty response');
          self.state = RequestStateEnum.Done;

          return response.data;
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          self.state = RequestStateEnum.Error;

          /** handle errors */
          if (axios.isAxiosError(error)) {
            return actions.handleApiError(error);
          }
        } finally {
          if (cancel) {
            cancel = null;
          }
        }
      }),
      /**
       * To stop requests on route change for example
       */
      cancel(message?: string) {
        if (cancel) {
          cancel.cancel(message || 'Request cancelled');
        }
      },
      handleApiError(error: AxiosError) {
        if (self.showError) {
          /** show api error */
        }

        if (error?.response?.status === BAD_FIELD_STATUS) {
          return error?.response?.data;
        }

        if (error?.response?.status === UNAUTHORIZED_STATUS) {
          /* keycloak.login(); */
        }
      }
    };
    return actions;
  })
  .views((self) => ({
    get isPending() {
      return self.state === RequestStateEnum.Pending;
    },
    get isDone() {
      return self.state === RequestStateEnum.Done;
    },
    get isError() {
      return self.state === RequestStateEnum.Error;
    },
    get isNotSend() {
      return self.state === null;
    },
    get isNotComplete() {
      return [RequestStateEnum.Pending, null].includes(self.state);
    }
  }));

export {RequestModel};

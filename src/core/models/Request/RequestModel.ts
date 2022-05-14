import {types, flow} from 'mobx-state-tree';
import axios, {AxiosRequestConfig, CancelTokenSource, AxiosError, AxiosResponse} from 'axios';

import {RequestState} from 'core/enums';

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
    state: types.maybeNull(types.enumeration(Object.values(RequestState)))
  })
  .actions((self) => {
    let cancel: CancelTokenSource | null = null;

    const actions = {
      send: flow(function* send<T, R extends {data: unknown; config: AxiosRequestConfig}>(
        action: (options: T) => Promise<R>,
        options: T
      ) {
        try {
          self.state = RequestState.Pending;

          if (self.isCancellable) {
            if (cancel) {
              actions.cancel(
                'Request cancelled: the same api call is being called multiple times subsequently'
              );
            }
            cancel = axios.CancelToken.source();
          }

          const response: AxiosResponse<R> = yield action({
            ...options,
            ...(self.isCancellable ? {cancelToken: cancel?.token} : {}),
            headers: {
              // additional headers if it needs
            }
          });

          console.assert(!!response, 'Got empty response');
          self.state = RequestState.Done;

          return response.data;
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          self.state = RequestState.Error;

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
      return self.state === RequestState.Pending;
    },
    get isDone() {
      return self.state === RequestState.Done;
    },
    get isError() {
      return self.state === RequestState.Error;
    },
    get isNotSend() {
      return self.state === null;
    },
    get isNotComplete() {
      return [RequestState.Pending, null].includes(self.state);
    }
  }));

export {RequestModel};

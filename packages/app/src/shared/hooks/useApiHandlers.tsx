import React, {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';
import {AxiosError} from 'axios';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';
import {httpErrorCodes} from 'api/constants';
import {REQUEST_MAX_RETRIES, REQUEST_RETRY_DELAY_BASE, setApiResponseHandlers} from 'api/request';

export const useApiHandlers = () => {
  const {sessionStore} = useStore();

  const navigate = useNavigate();
  const {t} = useI18n();

  const onErrorHandler = useCallback(
    (error: AxiosError) => {
      const status = error.response?.status;

      console.error('API Error:', {error, status, config: error.config});
      const statusString = String(error?.response?.status || '');

      switch (status) {
        case httpErrorCodes.MAINTENANCE:
          toast.error(
            <ToastContent
              isDanger
              icon="alert"
              title={statusString}
              text={t('systemMessages.underMaintenance')}
              showCloseButton
            />
          );
          break;

        case httpErrorCodes.INTERNAL_SYSTEM_ERROR:
          toast.error(
            <ToastContent
              isDanger
              icon="alert"
              title={statusString}
              text={t('errors.somethingWentWrong')}
              showCloseButton
            />
          );
          break;

        case httpErrorCodes.FORBIDDEN:
          toast.error(
            <ToastContent
              isDanger
              icon="alert"
              title={t('errors.permissionsMissing')}
              text={t('errors.permissionsWrong')}
              showCloseButton
            />
          );
          break;

        case httpErrorCodes.UNAUTHORIZED:
          sessionStore.signOutRedirect();
          break;
      }

      throw error;
    },
    [sessionStore, t]
  );

  useEffect(() => {
    setApiResponseHandlers({
      maxRetries: REQUEST_MAX_RETRIES,
      retryDelayBase: REQUEST_RETRY_DELAY_BASE,
      retryCodes: [httpErrorCodes.MAINTENANCE],

      // This is called after retrying failed request
      // if the error code matches retryCodes or if it doesn't match
      onError: onErrorHandler
    });
  }, [navigate, onErrorHandler, t]);
};

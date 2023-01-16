import React, {useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {AxiosError} from 'axios';

import {ToastContent} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {httpErrorCodes} from 'api/constants';
import {REQUEST_MAX_RETRIES, REQUEST_RETRY_DELAY_BASE, setApiResponseHandlers} from 'api/request';

export const useApiHandlers = () => {
  const history = useHistory();
  const {t} = useTranslation();

  const onErrorHandler = useCallback(
    (error: AxiosError) => {
      const status = error.response?.status;

      console.error('API Error:', {error, status, config: error.config});
      const statusString = String(error?.response?.status || '');

      switch (status) {
        case httpErrorCodes.MAINTENANCE:
          toast.info(
            <ToastContent
              headerIconName="check"
              title={statusString}
              text={t('systemMessages.underMaintenance')}
              showCloseButton
            />
          );
          break;

        case httpErrorCodes.INTERNAL_SYSTEM_ERROR:
          toast.info(
            <ToastContent
              headerIconName="check"
              title={statusString}
              text={t('errors.somethingWentWrong')}
              showCloseButton
            />
          );
          break;

        case httpErrorCodes.UNAUTHORIZED:
          document.location = ROUTES.signIn;
          break;
      }

      throw error;
    },
    [t]
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
  }, [history, onErrorHandler, t]);
};

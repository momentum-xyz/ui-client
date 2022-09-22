import React, {Suspense, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useErrorBoundary, withErrorBoundary} from 'react-use-error-boundary';

import {PluginLoaderInterface} from 'core/interfaces';
import {useDynamicScript} from 'shared/hooks';

const loadComponent = (scope: string, module: string) => async (): Promise<any> => {
  // @ts-ignore: Required to load list based plugins, no ts declaration
  await __webpack_init_sharing__('default');
  // @ts-ignore: Required to load list based plugins, window has no dict based declaration
  const container = window[scope];
  // @ts-ignore: Required to load list based plugins, cause window[scope] does not produce a type
  await container.init(__webpack_share_scopes__.default);
  // @ts-ignore: Required to load list based plugins, cause of previous problems
  const factory = await window[scope].get(module);
  return factory();
};

export const PluginLoader: FC<PluginLoaderInterface> = withErrorBoundary(
  ({name, url, config, module = './App'}) => {
    const {ready, failed} = useDynamicScript(module && url);
    const {t} = useTranslation();
    const [error] = useErrorBoundary();

    if (!module) {
      return <h2>{t('errors.noModuleSpecified')}</h2>;
    }

    if (!ready) {
      return <h2>{t('messages.loadingDynamicScript', {url})}</h2>;
    }

    if (failed || error) {
      return <h2>{t('errors.failedToLoadDynamicScript', {url})}</h2>;
    }

    const Component = React.lazy(loadComponent(name, module));

    return (
      <Suspense fallback={t('messages.loadingPlugin')}>
        <Component {...config} />
      </Suspense>
    );
  }
);

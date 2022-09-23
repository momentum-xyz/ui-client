import React, {Suspense, FC, memo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {ErrorBoundary} from 'shared/components';
import {PluginPropsType} from 'core/interfaces';

import {useDynamicScript} from './useDynamicScript';

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

interface PluginLoaderPropsInterface {
  name: string;
  url: string;
  props?: PluginPropsType;
  module?: string;
}

const PluginLoaderComponent: FC<PluginLoaderPropsInterface> = ({
  name,
  url,
  props,
  module = './App'
}) => {
  const {ready, failed} = useDynamicScript(module && url);
  const {t} = useTranslation();

  useEffect(() => {
    console.info('Mounting PluginLoaderComponent');
  }, []);

  useEffect(() => {
    console.info('Rerendering PluginLoaderComponent');
  });

  if (!module) {
    return <h2>{t('errors.noModuleSpecified')}</h2>;
  }

  if (!ready) {
    return <h2>{t('messages.loadingDynamicScript', {url})}</h2>;
  }

  if (failed) {
    return <h2>{t('errors.failedToLoadDynamicScript', {url})}</h2>;
  }

  const Component = React.lazy(loadComponent(name, module));

  return (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
      <Suspense fallback={t('messages.loadingPlugin')}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export const PluginLoader = memo(PluginLoaderComponent);

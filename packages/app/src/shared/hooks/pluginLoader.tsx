import React, {Suspense, FC, useMemo, ComponentType} from 'react';
import {useTranslation} from 'react-i18next';
import {PluginPropsType, PluginTypeEnum} from '@momentum/sdk';
import {ErrorBoundary} from '@momentum/ui-kit';

import {useDynamicScript} from './useDynamicScript';

const loadComponent =
  (scope: string, pluginType: PluginTypeEnum) =>
  async (): Promise<{default: ComponentType<PluginPropsType>}> => {
    // @ts-ignore: Required to load list based plugins, no ts declaration
    await __webpack_init_sharing__('default');
    // @ts-ignore: Required to load list based plugins, window has no dict based declaration
    const container = window[scope];
    // @ts-ignore: Required to load list based plugins, cause window[scope] does not produce a type
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore: Required to load list based plugins, cause of previous problems
    const factory = await window[scope].get('./Plugin');
    // @ts-ignore: Required to load list based plugins, cause of previous problems
    const plugin = factory().default;
    return {default: plugin[`${pluginType}Extension`]};
  };

interface PluginLoaderPropsInterface {
  id: string;
  url: string;
  props: PluginPropsType;
  pluginType: PluginTypeEnum;
}

const PluginLoader: FC<PluginLoaderPropsInterface> = ({id, url, props, pluginType}) => {
  const {ready, failed} = useDynamicScript(module && url);
  const {t} = useTranslation();

  const Component = useMemo(() => {
    return React.lazy(loadComponent(id, pluginType));
  }, [id, pluginType]);

  if (!ready) {
    return <h2>{t('messages.loadingDynamicScript', {url})}</h2>;
  }

  if (failed) {
    return <h2>{t('errors.failedToLoadDynamicScript', {url})}</h2>;
  }

  return (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
      <Suspense fallback={t('messages.loadingPlugin')}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export {PluginLoader};

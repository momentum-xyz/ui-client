import React, {Suspense, FC} from 'react';

import {useDynamicScript} from 'shared/hooks';

export interface PluginConfigInterface {
  onClose?: () => void;
}

export interface PluginInterface {
  name: string;
  url: string;
  exact?: boolean;
  config: PluginConfigInterface;
  module?: string;
}

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

const PluginLoader: FC<PluginInterface> = ({name, url, config, module = './App'}) => {
  const {ready, failed} = useDynamicScript(module && url);

  if (!module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  const Component = React.lazy(loadComponent(name, module));

  return (
    <Suspense fallback="Loading Plugin">
      <Component {...config} />
    </Suspense>
  );
};

export default PluginLoader;

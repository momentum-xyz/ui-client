import React, {Suspense, FC} from 'react';

import {useDynamicScript} from 'shared/hooks';

const loadComponent = (scope: string, module: string) => async (): Promise<any> => {
  // @ts-ignore
  await __webpack_init_sharing__('default');
  // @ts-ignore
  const container = window[scope];
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  // @ts-ignore
  const factory = await window[scope].get(module);
  return factory();
};

const ModuleLoader: FC<{scope: string; module: string; url: string}> = (props) => {
  const {ready, failed} = useDynamicScript(props.module && props.url);

  if (!props.module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.url}</h2>;
  }

  const Component = React.lazy(loadComponent(props.scope, props.module));

  return (
    <Suspense fallback="Loading Module">
      <Component />
    </Suspense>
  );
};

export default ModuleLoader;

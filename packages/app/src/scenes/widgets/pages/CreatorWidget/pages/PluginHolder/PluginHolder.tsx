import {FC, memo, useEffect, useMemo} from 'react';
import {useTheme} from 'styled-components';
import {ErrorBoundary, useMutableCallback} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider,
  UsePluginHookReturnInterface
} from '@momentum-xyz/sdk';

import {PluginLoaderModelType} from 'core/models';

interface PropsInterface {
  pluginLoader: PluginLoaderModelType;
  onCreatorTabChanged: (data: UsePluginHookReturnInterface['creatorTab']) => void;
}

const PluginHolder: FC<PropsInterface> = ({pluginLoader, onCreatorTabChanged}) => {
  useEffect(() => {
    console.log('PluginHolder');
    return () => {
      console.log('PluginHolder unmount');
    };
  }, []);

  const theme = useTheme();
  const {t} = useI18n();

  const onCreatorTabChangedMut = useMutableCallback(onCreatorTabChanged);

  const pluginProps: PluginPropsInterface = useMemo(
    () => ({
      // @ts-ignore: FIXME
      theme,
      isAdmin: true,
      // objectId,
      isExpanded: pluginLoader.isExpanded,
      onToggleExpand: pluginLoader.toggleIsExpanded,
      pluginApi: pluginLoader.attributesManager.pluginApi,
      onClose: () => {}
    }),
    [pluginLoader, theme]
  );

  return (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
      <ObjectGlobalPropsContextProvider props={pluginProps}>
        {pluginLoader.plugin ? (
          <PluginInnerWrapper
            onCreatorTabChanged={onCreatorTabChangedMut}
            pluginProps={pluginProps}
            plugin={pluginLoader.plugin}
          />
        ) : null}

        {pluginLoader.isError && <div>{t('errors.errorWhileLoadingPlugin')}</div>}
      </ObjectGlobalPropsContextProvider>
    </ErrorBoundary>
  );
};

const PluginInnerWrapper = memo(
  ({
    onCreatorTabChanged,
    pluginProps,
    plugin
  }: {
    onCreatorTabChanged: (data: UsePluginHookReturnInterface['creatorTab']) => void;
    pluginProps: PluginPropsInterface;
    plugin: PluginInterface;
    // hideWhenUnset: boolean;
  }) => {
    // const {t} = useI18n();

    const {creatorTab} = plugin.usePlugin(pluginProps);
    console.log('PluginInnerWrapper creatorTab', creatorTab);

    useEffect(() => {
      onCreatorTabChanged(creatorTab);
    }, [creatorTab, onCreatorTabChanged]);

    return null;
  }
);

export default PluginHolder;

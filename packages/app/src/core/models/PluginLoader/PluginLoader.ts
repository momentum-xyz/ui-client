import {flow, Instance, types} from 'mobx-state-tree';
import {IconNameType} from '@momentum/ui-kit';
import {PluginInterface} from '@momentum/sdk';
import {ResetModel} from '@momentum/core';

const PluginLoader = types
  .compose(
    ResetModel,
    types.model('PluginLoader', {
      name: types.string,
      subPath: types.string,
      subtitle: types.maybe(types.string),
      url: types.string,
      exact: types.maybe(types.boolean),
      module: types.maybe(types.string),
      iconName: types.frozen<IconNameType>(),

      isErrorWhileLoadingComponent: false,
      isErrorWhileLoadingDynamicScript: false,
      plugin: types.maybe(types.frozen<PluginInterface>())
    })
  )
  .volatile<{scriptElement?: HTMLScriptElement}>((self) => ({
    scriptElement: undefined
  }))
  .actions((self) => ({
    loadPlugin: flow(function* () {
      self.isErrorWhileLoadingComponent = false;

      try {
        self.plugin = yield (async (): Promise<PluginInterface> => {
          // @ts-ignore: Required to load list based plugins, no ts declaration
          await __webpack_init_sharing__('default');
          // @ts-ignore: Required to load list based plugins, window has no dict based declaration
          const container = window[self.name];
          // @ts-ignore: Required to load list based plugins, cause window[scope] does not produce a type
          await container.init(__webpack_share_scopes__.default);
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          const plugin = (await window[self.name].get('./Plugin'))().default;
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          return plugin;
        })();
      } catch {
        self.isErrorWhileLoadingComponent = true;
      }
    })
  }))
  .actions((self) => ({
    onDynamicScriptLoaded() {
      console.log(`Dynamic Script Loaded: ${self.url}`);
      self.loadPlugin();
    },
    onDynamicScriptError() {
      console.error(`Dynamic Script Error: ${self.url}`);
      self.isErrorWhileLoadingDynamicScript = true;
    }
  }))
  .actions((self) => ({
    init() {
      const element = document.createElement('script');

      element.src = self.url;
      element.type = 'text/javascript';
      element.async = true;

      self.isErrorWhileLoadingDynamicScript = false;

      element.onload = self.onDynamicScriptLoaded;
      element.onerror = self.onDynamicScriptError;

      self.scriptElement = element;
      document.head.appendChild(element);
    },
    deinit() {
      if (!self.scriptElement) {
        self.resetModel();
        return;
      }

      console.log(`Dynamic Script Removed: ${self.url}`);
      self.scriptElement.onerror = () => {};
      self.scriptElement.onload = () => {};
      document.head.removeChild(self.scriptElement);

      self.resetModel();
    }
  }))
  .views((self) => ({
    get isError(): boolean {
      return self.isErrorWhileLoadingComponent || self.isErrorWhileLoadingDynamicScript;
    }
  }));

export type PluginLoaderModelType = Instance<typeof PluginLoader>;

export {PluginLoader};

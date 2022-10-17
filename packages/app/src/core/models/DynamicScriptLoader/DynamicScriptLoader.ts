import {Instance, types} from 'mobx-state-tree';

import {DynamicScriptLoaderStatusEnum} from 'core/enums';

const DynamicScriptLoader = types
  .model('DynamicScriptLoader', {
    status: types.optional(
      types.enumeration(Object.values(DynamicScriptLoaderStatusEnum)),
      DynamicScriptLoaderStatusEnum.READY
    ),
    url: types.maybe(types.string),
    name: types.maybe(types.string)
  })
  .volatile<{_scriptElement?: HTMLScriptElement}>((self) => ({
    _scriptElement: undefined
  }))
  .actions((self) => ({
    onDynamicScriptLoaded() {
      console.log(`[DynamicScriptLoader] Dynamic Script Loaded: ${self.url}`);
      self.status = DynamicScriptLoaderStatusEnum.LOADED;
    },
    onDynamicScriptError() {
      console.error(`[DynamicScriptLoader] Dynamic Script Error: ${self.url}`);
      self.status = DynamicScriptLoaderStatusEnum.ERROR;
    }
  }))
  .actions((self) => ({
    init(name: string, url: string) {
      self.url = url;
      self.name = name;
      self.status = DynamicScriptLoaderStatusEnum.READY;

      if (self._scriptElement) {
        console.warn(
          `[DynamicScriptLoader] Script '${url}' with name ${name} has been already loaded.`
        );
        return;
      }

      self.status = DynamicScriptLoaderStatusEnum.LOADING;

      const element = document.createElement('script');

      element.src = url;
      element.type = 'text/javascript';
      element.async = true;

      element.onload = self.onDynamicScriptLoaded;
      element.onerror = self.onDynamicScriptError;

      self._scriptElement = element;
      document.head.appendChild(element);
    }
  }))
  .views((self) => ({
    get script(): HTMLScriptElement | undefined {
      return self._scriptElement;
    },
    get isLoaded(): boolean {
      return self.status === DynamicScriptLoaderStatusEnum.LOADED;
    },
    get isError(): boolean {
      return self.status === DynamicScriptLoaderStatusEnum.ERROR;
    },
    get isLoading(): boolean {
      return self.status === DynamicScriptLoaderStatusEnum.LOADING;
    },
    get isReady(): boolean {
      return self.status === DynamicScriptLoaderStatusEnum.READY;
    }
  }));

export type DynamicScriptLoaderType = Instance<typeof DynamicScriptLoader>;

export {DynamicScriptLoader};

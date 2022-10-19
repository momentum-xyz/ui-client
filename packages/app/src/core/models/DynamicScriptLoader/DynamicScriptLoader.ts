import {Instance, types} from 'mobx-state-tree';

import {LoaderStatusEnum} from 'core/enums';

const DynamicScriptLoader = types
  .model('DynamicScriptLoader', {
    status: types.optional(
      types.enumeration(Object.values(LoaderStatusEnum)),
      LoaderStatusEnum.READY
    ),
    url: types.maybe(types.string),
    name: types.maybe(types.string)
  })
  .actions((self) => {
    let scriptElement: HTMLScriptElement | undefined = undefined;

    return {
      onDynamicScriptLoaded() {
        console.log(`[DynamicScriptLoader] Dynamic Script Loaded: ${self.url}`);
        self.status = LoaderStatusEnum.LOADED;
      },
      onDynamicScriptError() {
        console.error(`[DynamicScriptLoader] Dynamic Script Error: ${self.url}`);
        self.status = LoaderStatusEnum.ERROR;
      },
      init(name: string, url: string) {
        self.url = url;
        self.name = name;
        self.status = LoaderStatusEnum.READY;

        if (scriptElement) {
          console.warn(
            `[DynamicScriptLoader] Script '${url}' with name ${name} has been already loaded.`
          );
          return;
        }

        self.status = LoaderStatusEnum.LOADING;

        const element = document.createElement('script');

        element.src = url;
        element.type = 'text/javascript';
        element.async = true;

        element.onload = this.onDynamicScriptLoaded;
        element.onerror = this.onDynamicScriptError;

        scriptElement = element;
        document.head.appendChild(element);
      }
    };
  })
  .views((self) => ({
    get isLoaded(): boolean {
      return self.status === LoaderStatusEnum.LOADED;
    },
    get isError(): boolean {
      return self.status === LoaderStatusEnum.ERROR;
    },
    get isLoading(): boolean {
      return self.status === LoaderStatusEnum.LOADING;
    },
    get isReady(): boolean {
      return self.status === LoaderStatusEnum.READY;
    }
  }));

export type DynamicScriptLoaderType = Instance<typeof DynamicScriptLoader>;

export {DynamicScriptLoader};

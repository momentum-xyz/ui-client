import {cast, Instance, types} from 'mobx-state-tree';

import {DynamicScriptLoader, DynamicScriptLoaderType} from 'core/models/DynamicScriptLoader';

const DynamicScriptsStore = types
  .model('DynamicScriptsStore', {
    loaders: types.array(DynamicScriptLoader)
  })
  .actions((self) => ({
    addScript(name: string, url: string) {
      if (self.loaders.find((loader) => loader.name === name)) {
        console.warn(`[DynamicScriptsStore] Script '${name}' has already been loaded.`);
        return;
      }

      const loader = DynamicScriptLoader.create();
      self.loaders = cast([...self.loaders, loader]);

      loader.init(name, url);
    },
    getScript(name: string): DynamicScriptLoaderType | undefined {
      return self.loaders.find((loader) => loader.name === name);
    },
    containsLoaderWithName(name: string): boolean {
      return !!self.loaders.find((loader) => loader.name === name);
    }
  }));

export type DynamicScriptsStoreType = Instance<typeof DynamicScriptsStore>;

export {DynamicScriptsStore};

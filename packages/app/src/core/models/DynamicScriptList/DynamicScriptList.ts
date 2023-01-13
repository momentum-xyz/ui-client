import {cast, flow, types} from 'mobx-state-tree';

import {DynamicScriptLoader, DynamicScriptLoaderType} from 'core/models/DynamicScriptLoader';

const DynamicScriptList = types
  .model('DynamicScriptList', {
    loaders: types.array(DynamicScriptLoader)
  })
  .actions((self) => ({
    addScript: flow(function* (name: string, url: string) {
      if (self.loaders.find((loader) => loader.name === name)) {
        console.warn(`Script '${name}' has already been loaded.`);
        return;
      }

      const loader = DynamicScriptLoader.create();
      self.loaders = cast([...self.loaders, loader]);

      yield loader.init(name, url);
    }),
    getScript(name: string): DynamicScriptLoaderType | undefined {
      return self.loaders.find((loader) => loader.name === name);
    },
    containsLoaderWithName(name: string): boolean {
      return !!self.loaders.find((loader) => loader.name === name);
    }
  }));

export {DynamicScriptList};

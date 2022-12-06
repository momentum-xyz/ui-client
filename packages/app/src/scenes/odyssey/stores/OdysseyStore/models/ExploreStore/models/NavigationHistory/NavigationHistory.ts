import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SpaceInfo, SpaceInfoModelInterface} from 'core/models';
import {SpaceDetailsModelInterface} from 'scenes/odyssey/stores/OdysseyStore/models';

const NavigationHistory = types
  .compose(
    ResetModel,
    types.model('NavigationHistory', {
      history: types.optional(types.array(SpaceInfo), [])
    })
  )
  .actions((self) => ({
    addSpaceToHistory(space: SpaceDetailsModelInterface | null): void {
      if (space) {
        self.history = cast([...self.history, {...space}]);
      }
    },
    goBackToPreviousSpace(): string | undefined {
      return self.history.length > 0 ? self.history.pop()?.id : undefined;
    }
  }))
  .views((self) => ({
    get previousSpace(): SpaceInfoModelInterface | null {
      return self.history.length > 0 ? self.history[self.history.length - 1] : null;
    }
  }));

export {NavigationHistory};

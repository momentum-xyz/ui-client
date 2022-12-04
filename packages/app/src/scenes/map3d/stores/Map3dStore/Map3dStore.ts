import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {OdysseyItemInterface} from 'scenes/explore/stores';

const Map3dStore = types
  .compose(
    ResetModel,
    types.model('Map3dStore', {
      selectedOdyssey: types.maybeNull(types.frozen<OdysseyItemInterface>())
    })
  )
  .actions((self) => ({
    selectOdyssey(id: string, name: string): void {
      self.selectedOdyssey = cast({
        id: id,
        name: name,
        collectionId: 10,
        owner: '',
        description: '',
        image: 'https://picsum.photos/100',
        connections: 1,
        docking: 2,
        events: 3
      });
    },
    unselectOdyssey(): void {
      self.selectedOdyssey = null;
    }
  }));

export {Map3dStore};

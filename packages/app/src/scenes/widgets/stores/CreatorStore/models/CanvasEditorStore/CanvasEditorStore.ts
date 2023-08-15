import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {CanvasMissionFormInterface} from 'core/interfaces';

import {MissionData} from './models';

const CanvasEditorStore = types
  .compose(
    ResetModel,
    types.model('CanvasEditorStore', {
      missionData: types.optional(MissionData, {}),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    setMissionData(form: CanvasMissionFormInterface): void {
      self.missionData = MissionData.create({...form});
    }
  }))
  .views((self) => ({
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {CanvasEditorStore};

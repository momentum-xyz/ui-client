import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {CanvasMissionFormInterface, CanvasQuestionsFormInterface} from 'core/interfaces';

import {MissionData, QuestionsData} from './models';

const CanvasEditorStore = types
  .compose(
    ResetModel,
    types.model('CanvasEditorStore', {
      missionData: types.optional(MissionData, {}),
      questionsData: types.optional(QuestionsData, {}),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    setMissionData(form: CanvasMissionFormInterface): void {
      self.missionData = MissionData.create({...form});
    },
    setQuestionsData(form: CanvasQuestionsFormInterface): void {
      self.questionsData = QuestionsData.create({...form});
    }
  }))
  .views((self) => ({
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {CanvasEditorStore};

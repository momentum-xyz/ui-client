import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {
  CanvasMissionFormInterface,
  CanvasQuestionsFormInterface,
  CanvasScriptFormInterface
} from 'core/interfaces';

import {MissionData, QuestionsData, ScriptData} from './models';

const CanvasEditorStore = types
  .compose(
    ResetModel,
    types.model('CanvasEditorStore', {
      missionData: types.optional(MissionData, {}),
      questionsData: types.optional(QuestionsData, {}),
      scriptData: types.optional(ScriptData, {}),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    setMissionData(form: CanvasMissionFormInterface): void {
      self.missionData = MissionData.create({...form});
    },
    setQuestionsData(form: CanvasQuestionsFormInterface): void {
      self.questionsData = QuestionsData.create({...form});
    },
    setScriptData(form: CanvasScriptFormInterface): void {
      self.scriptData = ScriptData.create({...form});
    }
  }))
  .views((self) => ({
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {CanvasEditorStore};

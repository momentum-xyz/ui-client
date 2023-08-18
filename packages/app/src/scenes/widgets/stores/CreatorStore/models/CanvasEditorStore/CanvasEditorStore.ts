import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {
  CanvasMissionFormInterface,
  CanvasQuestionsFormInterface,
  CanvasScriptFormInterface,
  CanvasTeamworkScriptFormInterface
} from 'core/interfaces';

import {MissionData, QuestionsData, ScriptData, TeamworkScriptData} from './models';

const CanvasEditorStore = types
  .compose(
    ResetModel,
    types.model('CanvasEditorStore', {
      wasSubmitted: false,
      wasSpawned: false,
      version: '01',
      created: types.maybeNull(types.string),
      leonardoCosts: 20,
      chatGPTCosts: 12,
      contributionAmount: types.maybeNull(types.number),
      missionData: types.optional(MissionData, {}),
      questionsData: types.optional(QuestionsData, {}),
      scriptData: types.optional(ScriptData, {}),
      teamworkScriptData: types.optional(TeamworkScriptData, {}),

      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    setCreated(dateISO: string): void {
      self.created = dateISO;
    },
    setMissionData(form: CanvasMissionFormInterface): void {
      self.missionData = MissionData.create({...form});
    },
    setQuestionsData(form: CanvasQuestionsFormInterface): void {
      self.questionsData = QuestionsData.create({...form});
    },
    setScriptData(form: CanvasScriptFormInterface): void {
      self.scriptData = ScriptData.create({...form});
    },
    setTeamworkScriptData(form: CanvasTeamworkScriptFormInterface): void {
      self.teamworkScriptData = TeamworkScriptData.create({...form});
    },
    setContributionAmount(amount: number | null) {
      self.contributionAmount = amount;
    }
  }))
  .actions((self) => ({
    submitCanvas(): void {
      // TODO: Implementation
      self.wasSubmitted = true;
    }
  }))
  .views((self) => ({
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {CanvasEditorStore};

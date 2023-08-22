import {flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {ObjectTypeIdEnum, RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {getRootStore} from 'core/utils';
import {api, FetchWorldTreeResponse, GetSpaceAttributeResponse, PostSpaceResponse} from 'api';
import {PosBusService} from 'shared/services';
import {CanvasConfigInterface} from 'api/interfaces';
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
      canvasObjectId: types.maybeNull(types.string),

      version: '01',
      created: '',
      leonardoCosts: 20,
      chatGPTCosts: 12,
      contributionAmount: types.maybeNull(types.number),
      missionData: types.optional(MissionData, {}),
      questionsData: types.optional(QuestionsData, {}),
      scriptData: types.optional(ScriptData, {}),
      teamworkScriptData: types.optional(TeamworkScriptData, {}),

      request: types.optional(RequestModel, {}),
      spawnRequest: types.optional(RequestModel, {}),
      attributeRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getCanvasConfig(): CanvasConfigInterface {
      return {
        created: self.created,
        version: self.version,
        missionTitle: self.missionData.missionTitle,
        missionStory: self.missionData.missionStory,
        questionOne: self.questionsData.questionOne,
        questionTwo: self.questionsData.questionTwo,
        questionThree: self.questionsData.questionThree,
        questionFour: self.questionsData.questionFour,
        isLeonardo: self.scriptData.isLeonardo,
        leonardoScript: self.scriptData.script,
        leonardoModelId: self.scriptData.modelId,
        isChatGPT: self.teamworkScriptData.isChatGPT,
        chatGPTScript: self.teamworkScriptData.script,
        chatGPTScriptTitle: self.teamworkScriptData.scriptTitle,
        contributionAmount: self.contributionAmount || 0
      };
    },
    setCanvasConfig(config: CanvasConfigInterface): void {
      self.created = config.created;
      self.version = config.version;
      self.missionData.missionTitle = config.missionTitle;
      self.missionData.missionStory = config.missionStory;
      self.questionsData.questionOne = config.questionOne;
      self.questionsData.questionTwo = config.questionTwo;
      self.questionsData.questionThree = config.questionThree;
      self.questionsData.questionFour = config.questionFour;
      self.scriptData.isLeonardo = config.isLeonardo;
      self.scriptData.script = config.leonardoScript;
      self.scriptData.modelId = config.leonardoModelId;
      self.teamworkScriptData.isChatGPT = config.isChatGPT;
      self.teamworkScriptData.script = config.chatGPTScript;
      self.teamworkScriptData.scriptTitle = config.chatGPTScriptTitle;
      self.contributionAmount = config.contributionAmount;
    }
  }))
  .actions((self) => ({
    load: flow(function* (worldId: string) {
      const response: FetchWorldTreeResponse = yield self.request.send(
        api.spaceRepository.fetchWorldTree,
        {
          worldId: worldId,
          max_depth: 1,
          object_type: ObjectTypeIdEnum.CANVAS
        }
      );

      if (response?.total_direct_children > 0) {
        const objectArray = Object.values(response.children);
        const canvasObjectId = objectArray[0].id;

        self.canvasObjectId = canvasObjectId;

        const configAttribute: GetSpaceAttributeResponse | null = yield self.attributeRequest.send(
          api.spaceAttributeRepository.getSpaceAttribute,
          {
            spaceId: canvasObjectId,
            plugin_id: PluginIdEnum.CANVAS_EDITOR,
            attribute_name: AttributeNameEnum.CANVAS
          }
        );

        if (configAttribute) {
          self.setCanvasConfig(configAttribute as CanvasConfigInterface);
        }
      }
    }),
    spawnAndSubmit: flow(function* (worldId: string) {
      PosBusService.attachNextReceivedObjectToCamera = true;

      // 1. Spawn object
      const response: PostSpaceResponse | undefined = yield self.spawnRequest.send(
        api.spaceRepository.postSpace,
        {
          minimap: true,
          parent_id: worldId,
          object_name: 'Canvas',
          object_type_id: ObjectTypeIdEnum.CANVAS
        }
      );

      // 2. Save object attribute
      if (response?.object_id) {
        yield self.attributeRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: response.object_id,
          plugin_id: PluginIdEnum.CANVAS_EDITOR,
          attribute_name: AttributeNameEnum.CANVAS,
          value: self.getCanvasConfig()
        });
      }

      // 3. Attach to camera
      if (response?.object_id) {
        getRootStore(self).universeStore.world3dStore?.setAttachedToCamera(response.object_id);
      }

      return response?.object_id;
    }),
    delete: flow(function* () {
      yield self.deleteRequest.send(api.spaceRepository.deleteSpace, {
        spaceId: self.canvasObjectId || ''
      });

      return self.deleteRequest.isDone;
    })
  }))
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
  .views((self) => ({
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));

export {CanvasEditorStore};

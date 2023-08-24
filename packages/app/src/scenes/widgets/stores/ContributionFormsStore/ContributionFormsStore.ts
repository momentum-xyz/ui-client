import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {api, GetSpaceAttributeResponse} from 'api';
import {CanvasConfigInterface} from 'api/interfaces';
import {ContributionAnswersFormInterface, ContributionImageFormInterface} from 'core/interfaces';

import {AnswersData, ImageData} from './models';

const ContributionFormsStore = types.compose(
  ResetModel,
  types
    .model('ContributionFormsStore', {
      config: types.maybeNull(types.frozen<CanvasConfigInterface>()),
      answersData: types.optional(AnswersData, {}),
      imageData: types.optional(ImageData, {}),

      configRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      loadConfig: flow(function* (objectId: string) {
        const configAttribute: GetSpaceAttributeResponse | null = yield self.configRequest.send(
          api.spaceAttributeRepository.getSpaceAttribute,
          {
            spaceId: objectId,
            plugin_id: PluginIdEnum.CANVAS_EDITOR,
            attribute_name: AttributeNameEnum.CANVAS
          }
        );

        if (configAttribute) {
          self.config = cast(configAttribute as CanvasConfigInterface);
        }
      }),
      setAnswersData(form: ContributionAnswersFormInterface): void {
        self.answersData = AnswersData.create({...form});
      },
      setImageData(form: ContributionImageFormInterface): void {
        // TODO:
      }
    }))
    .views(() => ({}))
);

export {ContributionFormsStore};

import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, TemplatesResponse} from 'api';

import {WorldBuilderTemplate, WorldBuilderTemplateInterface} from './models';

const WorldBuilderTemplatesStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderTemplatesStore', {
      request: types.optional(RequestModel, {}),

      templates: types.optional(types.array(WorldBuilderTemplate), []),
      selectedTemplate: types.maybe(types.reference(WorldBuilderTemplate))
    })
  )
  .actions((self) => ({
    fetchTemplates: flow(function* () {
      const response: TemplatesResponse = yield self.request.send(
        api.worldBuilderRepository.getTemplates,
        {}
      );

      if (response) {
        self.templates = cast(response);
      }
    }),
    selectTemplate(template: WorldBuilderTemplateInterface) {
      self.selectedTemplate = template;
    },
    unselectTemplate() {
      self.selectedTemplate = undefined;
    }
  }));

export {WorldBuilderTemplatesStore};

import {cast, flow, types} from 'mobx-state-tree';

import {api, TemplatesResponse} from 'api';
import {RequestModel, ResetModel} from 'core/models';

import {WorldBuilderTemplate, WorldBuilderTemplateModelInterface} from './models';

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
    selectTemplate(template: WorldBuilderTemplateModelInterface) {
      self.selectedTemplate = template;
    },
    unselectTemplate() {
      self.selectedTemplate = undefined;
    }
  }));

export {WorldBuilderTemplatesStore};

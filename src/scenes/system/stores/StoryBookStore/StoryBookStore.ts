import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const StoryBookStore = types.compose(
  ResetModel,
  types.model('StoryBookStore', {
    dialogOne: types.optional(DialogModel, {}),
    dialogTwo: types.optional(DialogModel, {}),
    dialogThree: types.optional(DialogModel, {}),
    dialogFour: types.optional(DialogModel, {}),
    dialogFive: types.optional(DialogModel, {})
  })
);

export {StoryBookStore};

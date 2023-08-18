import {Instance, types} from 'mobx-state-tree';

import {LeonardoModelIdEnum} from 'core/enums';

const ScriptData = types.model('ScriptData', {
  isLeonardo: true,
  script: types.maybe(types.string),
  modelId: types.maybe(types.enumeration(Object.values(LeonardoModelIdEnum)))
});

export interface ScriptDataModelInterface extends Instance<typeof ScriptData> {}

export {ScriptData};

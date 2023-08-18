import {Instance, types} from 'mobx-state-tree';

const TeamworkScriptData = types.model('TeamworkScriptData', {
  isChatGPT: true,
  script: types.maybe(types.string),
  scriptTitle: types.maybe(types.string)
});

export interface TeamworkScriptDataModelInterface extends Instance<typeof TeamworkScriptData> {}

export {TeamworkScriptData};

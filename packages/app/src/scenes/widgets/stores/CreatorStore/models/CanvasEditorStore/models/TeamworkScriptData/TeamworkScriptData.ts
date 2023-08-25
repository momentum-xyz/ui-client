import {Instance, types} from 'mobx-state-tree';

const TeamworkScriptData = types.model('TeamworkScriptData', {
  isChatGPT: true,
  script: types.maybeNull(types.string),
  scriptTitle: types.maybeNull(types.string)
});

export interface TeamworkScriptDataModelInterface extends Instance<typeof TeamworkScriptData> {}

export {TeamworkScriptData};

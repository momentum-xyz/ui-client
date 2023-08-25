import {Instance, types} from 'mobx-state-tree';

const MissionData = types.model('MissionData', {
  missionTitle: '',
  missionStory: ''
});

export interface MissionDataModelInterface extends Instance<typeof MissionData> {}

export {MissionData};

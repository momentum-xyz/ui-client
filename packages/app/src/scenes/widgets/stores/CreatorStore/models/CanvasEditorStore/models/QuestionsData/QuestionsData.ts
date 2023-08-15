import {Instance, types} from 'mobx-state-tree';

const QuestionsData = types.model('QuestionsData', {
  questionOne: '',
  questionTwo: '',
  questionThree: '',
  questionFour: ''
});

export interface QuestionsDataModelInterface extends Instance<typeof QuestionsData> {}

export {QuestionsData};

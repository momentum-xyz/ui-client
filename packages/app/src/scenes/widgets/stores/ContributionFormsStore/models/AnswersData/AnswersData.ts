import {Instance, types} from 'mobx-state-tree';

const AnswersData = types.model('AnswersData', {
  answerOne: '',
  answerTwo: '',
  answerThree: '',
  answerFour: ''
});

export interface AnswersDataModelInterface extends Instance<typeof AnswersData> {}

export {AnswersData};

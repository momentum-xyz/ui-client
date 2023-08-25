import {LeonardoModelIdEnum} from 'core/enums';

export interface CanvasMissionFormInterface {
  missionTitle: string;
  missionStory: string;
}

export interface CanvasQuestionsFormInterface {
  questionOne: string;
  questionTwo: string;
  questionThree: string;
  questionFour: string;
}

export interface CanvasScriptFormInterface {
  isLeonardo: boolean;
  script: string | null;
  modelId: LeonardoModelIdEnum | null;
}

export interface CanvasTeamworkScriptFormInterface {
  isChatGPT: boolean;
  script: string | null;
  scriptTitle: string | null;
}

export interface ContributionAnswersFormInterface {
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  answerFour: string;
}

export interface ContributionImageFormInterface {
  file?: File | null;
  fileUrlOrHash?: string | null;
}

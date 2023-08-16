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
  isAIAvailable: boolean;
  script?: string;
  modelId?: LeonardoModelIdEnum;
}

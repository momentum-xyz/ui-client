import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {LeonardoModelIdEnum} from 'core/enums';

export interface CanvasConfigInterface extends AttributeValueInterface {
  created: string;
  version: string;
  missionTitle: string;
  missionStory: string;
  questionOne: string;
  questionTwo: string;
  questionThree: string;
  questionFour: string;
  isLeonardo: boolean;
  leonardoScript: string | null;
  leonardoModelId: LeonardoModelIdEnum | null;
  isChatGPT: boolean;
  chatGPTScript: string | null;
  chatGPTScriptTitle: string | null;
  contributionAmount: number;
}

export interface UserContributionInterface extends AttributeValueInterface {
  created: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  answerFour: string;
  render_hash: string;
}

import {FC, ReactElement, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';
import {Hexagon, IconSvg, Round, Select, SelectOptionInterface} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import leonardoImage from 'static/images/leonardo.jpeg';
import aiProfileImage from 'static/images/ai_profile.jpeg';
import cubeImage from 'static/images/cube.svg';
import {QuestionsDataModelInterface} from 'scenes/widgets/stores/CreatorStore/models';

import {CanvasStepInterface} from '../../CanvasEditor';

import * as styled from './OverviewStep.styled';

interface PropsInterface {
  isNewCanvas: boolean;
  prevStep: CanvasStepInterface<CanvasStepType>;
  version: string;
  created: string | null;
  missionTitle: string;
  chatGPTCosts: number;
  leonardoCosts: number;
  isChatGPT: boolean;
  isChatGPTEnabled: boolean;
  isLeonardo: boolean;
  isLeonardoEnabled: boolean;
  contributionAmount: number | null;
  questionsData: QuestionsDataModelInterface;
  setContributionAmount: (amount: number | null) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onSpawnAndSubmit: () => void;
  onSpawned: () => void;
}

export const CREDITS_AMOUNT_OPTIONS: SelectOptionInterface<number>[] = [
  {label: '10', value: 10},
  {label: '20', value: 20},
  {label: '50', value: 50},
  {label: '70', value: 70}
];

const OverviewStep: FC<PropsInterface> = ({
  isNewCanvas,
  prevStep,
  version,
  created,
  missionTitle,
  chatGPTCosts,
  leonardoCosts,
  isChatGPTEnabled,
  isChatGPT,
  isLeonardoEnabled,
  isLeonardo,
  contributionAmount,
  questionsData,
  setContributionAmount,
  setActiveStep,
  onRenderActions,
  onSpawnAndSubmit,
  onSpawned
}) => {
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const {t} = useI18n();

  const aiCosts: number = useMemo(() => {
    const costs = isLeonardo ? leonardoCosts : 0;
    return isChatGPT ? costs + chatGPTCosts : costs;
  }, [leonardoCosts, chatGPTCosts, isLeonardo, isChatGPT]);

  const aiIsNotEnabled = !isLeonardoEnabled && !isChatGPTEnabled;

  const isPreviewButtonAvailable = isNewCanvas && !wasSubmitted;
  const isSpawnButtonAvailable = isNewCanvas && wasSubmitted;

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep(prevStep.id)
        }}
        {...(isPreviewButtonAvailable && {
          nextProps: {
            icon: 'idea',
            disabled: !contributionAmount,
            label: t('actions.previewCanvas'),
            onClick: async () => {
              await onSpawnAndSubmit();
              setWasSubmitted(true);
            }
          }
        })}
        {...(isSpawnButtonAvailable && {
          nextProps: {
            icon: 'idea',
            label: t('actions.spawnCanvas'),
            onClick: () => onSpawned()
          }
        })}
      />
    );
  }, [contributionAmount, isPreviewButtonAvailable, isSpawnButtonAvailable, prevStep]);

  return (
    <styled.Container data-testid="OverviewStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="idea" />
          <div>
            <div>{missionTitle}</div>
            <styled.Label>
              {t('labels.version', {version})} / {dateWithoutTime(created)}
            </styled.Label>
          </div>
        </styled.Header>

        <styled.Separator />

        {aiIsNotEnabled ? (
          <>
            <styled.SubTitle>{t('titles.questions')}</styled.SubTitle>

            <styled.QuestionsGrid>
              <styled.QuestionBlock>
                <Round label={1} />
                <styled.Question>{questionsData.questionOne}</styled.Question>
              </styled.QuestionBlock>
              <styled.QuestionBlock>
                <Round label={2} />
                <styled.Question>{questionsData.questionTwo}</styled.Question>
              </styled.QuestionBlock>
              <styled.QuestionBlock>
                <Round label={3} />
                <styled.Question>{questionsData.questionThree}</styled.Question>
              </styled.QuestionBlock>

              {!!questionsData.questionFour && (
                <styled.QuestionBlock>
                  <Round label={4} />
                  <styled.Question>{questionsData.questionFour}</styled.Question>
                </styled.QuestionBlock>
              )}
            </styled.QuestionsGrid>
          </>
        ) : (
          <>
            <styled.Header>
              <Hexagon type="fourth-borderless" iconName="connect" />
              <div>{t('titles.overviewAITools')}</div>
            </styled.Header>

            {isChatGPTEnabled && (
              <styled.AIInfoContainer className={cn(!isChatGPT && 'disabled')}>
                <styled.AIImage src={aiProfileImage} />
                <styled.AIInfo>
                  <div>{t('actions.chatGPT')}</div>
                  <span>{t('labels.maxAICredits', {count: chatGPTCosts})}</span>
                </styled.AIInfo>
              </styled.AIInfoContainer>
            )}

            {isLeonardoEnabled && (
              <styled.AIInfoContainer className={cn(!isLeonardo && 'disabled')}>
                <styled.AIImage src={leonardoImage} />
                <styled.AIInfo>
                  <div>{t('actions.leonardo')}</div>
                  <span>{t('labels.maxAICredits', {count: leonardoCosts})}</span>
                </styled.AIInfo>
              </styled.AIInfoContainer>
            )}

            <styled.MaxCredits>
              {isChatGPT || isLeonardo ? (
                <>{t('labels.maxAICredits', {count: aiCosts})}</>
              ) : (
                <>{t('labels.noAITools')}</>
              )}
            </styled.MaxCredits>
          </>
        )}

        <styled.Separator />
        <styled.CreditsContainer>
          <styled.SubTitle>{t('titles.setContributionsAmount')}</styled.SubTitle>
          <styled.AmountGrid className={cn(aiIsNotEnabled && 'noAI')}>
            <styled.SubTitle>{t('actions.setAmount')}</styled.SubTitle>
            <Select
              wide
              isClearable
              isDisabled={!isNewCanvas || wasSubmitted}
              value={contributionAmount}
              options={CREDITS_AMOUNT_OPTIONS}
              placeholder={t('placeholders.contributions')}
              onSingleChange={setContributionAmount}
            />

            {!aiIsNotEnabled && (
              <styled.AICreditsContainer>
                {t('labels.aiCredits', {
                  amount: !contributionAmount ? 'XX' : contributionAmount * aiCosts
                })}
              </styled.AICreditsContainer>
            )}
          </styled.AmountGrid>
        </styled.CreditsContainer>

        {isPreviewButtonAvailable && (
          <>
            <styled.Separator />
            <styled.SubTitle>{t('titles.placeCentralObject')}</styled.SubTitle>

            <styled.PreviewContainer>
              <styled.ImageContainer>
                <styled.Image src={cubeImage} />
              </styled.ImageContainer>
              <styled.PreviewInfo>
                <div>{t('descriptions.canvasStep6_One')}</div>
                <div>{t('descriptions.canvasStep6_Two')}</div>
              </styled.PreviewInfo>
            </styled.PreviewContainer>
          </>
        )}

        {isSpawnButtonAvailable && (
          <>
            <styled.Separator />
            <styled.SubTitle>{t('titles.placeCentralObject')}</styled.SubTitle>
            <styled.PreviewContainer>
              <styled.ImageContainer>
                <styled.Image src={cubeImage} />
              </styled.ImageContainer>
              <styled.FlightMessage>
                <IconSvg name="alert" isWhite />
                <div>{t('descriptions.canvasStep6_Three')}</div>
              </styled.FlightMessage>
            </styled.PreviewContainer>
          </>
        )}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(OverviewStep);

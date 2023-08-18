import {FC, ReactElement, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';
import {Hexagon, Select, SelectOptionInterface} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import leonardoImage from 'static/images/leonardo.jpeg';
import aiProfileImage from 'static/images/ai_profile.jpeg';

import * as styled from './OverviewStep.styled';

interface PropsInterface {
  version: string;
  created: string | null;
  missionTitle: string;
  aiTextCreditsCount: number;
  aiImageCreditsCount: number;
  isTextAIAvailable: boolean;
  isImageAIAvailable: boolean;
  contributionAmount: number | null;
  setContributionAmount: (amount: number | null) => void;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onSubmitCanvas: () => void;
}

export const CREDITS_AMOUNT_OPTIONS: SelectOptionInterface<number>[] = [
  {label: '10', value: 10},
  {label: '20', value: 20},
  {label: '50', value: 50},
  {label: '70', value: 70}
];

const OverviewStep: FC<PropsInterface> = ({
  version,
  created,
  missionTitle,
  aiTextCreditsCount,
  aiImageCreditsCount,
  isTextAIAvailable,
  isImageAIAvailable,
  contributionAmount,
  setContributionAmount,
  setActiveStep,
  onRenderActions,
  onSubmitCanvas
}) => {
  const {t} = useI18n();

  const isAIAvailable: boolean = useMemo(() => {
    return isImageAIAvailable || isTextAIAvailable;
  }, [isImageAIAvailable, isTextAIAvailable]);

  const maxCreditsAvailable: number = useMemo(() => {
    if (isImageAIAvailable && isTextAIAvailable) {
      return aiImageCreditsCount + aiTextCreditsCount;
    } else if (isImageAIAvailable && !isTextAIAvailable) {
      return aiImageCreditsCount;
    } else if (!isImageAIAvailable && isTextAIAvailable) {
      return aiTextCreditsCount;
    } else {
      return 0;
    }
  }, [aiImageCreditsCount, aiTextCreditsCount, isImageAIAvailable, isTextAIAvailable]);

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep('teamworkScript')
        }}
        nextProps={{
          icon: 'idea',
          disabled: true, // TODO
          label: t('labels.???'),
          onClick: () => {
            // TODO
            onSubmitCanvas();
          }
        }}
      />
    );
  }, []);

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

        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="connect" />
          <div>{t('titles.overviewAITools')}</div>
        </styled.Header>

        <styled.AIInfoContainer className={cn(!isTextAIAvailable && 'disabled')}>
          <styled.AIImage src={aiProfileImage} />
          <styled.AIInfo>
            <div>{t('actions.chatGPT')}</div>
            <span>{t('labels.maxAICredits', {count: aiTextCreditsCount})}</span>
          </styled.AIInfo>
        </styled.AIInfoContainer>

        <styled.AIInfoContainer className={cn(!isImageAIAvailable && 'disabled')}>
          <styled.AIImage src={leonardoImage} />
          <styled.AIInfo>
            <div>{t('actions.leonardo')}</div>
            <span>{t('labels.maxAICredits', {count: aiImageCreditsCount})}</span>
          </styled.AIInfo>
        </styled.AIInfoContainer>

        <styled.MaxCredits>
          {isTextAIAvailable || isImageAIAvailable ? (
            <>{t('labels.maxAICredits', {count: maxCreditsAvailable})}</>
          ) : (
            <>{t('labels.noAITools')}</>
          )}
        </styled.MaxCredits>

        <styled.Separator />

        {isAIAvailable && (
          <styled.CreditsContainer>
            <styled.SubTitle>{t('titles.setContributionsAmount')}</styled.SubTitle>
            <styled.AmountGrid>
              <styled.SubTitle>{t('actions.setAmount')}</styled.SubTitle>
              <Select
                wide
                isClearable
                value={contributionAmount}
                options={CREDITS_AMOUNT_OPTIONS}
                placeholder={t('placeholders.contributions')}
                onSingleChange={setContributionAmount}
              />

              <styled.AICreditsContainer>
                {t('labels.aiCredits', {amount: 'XX'})}
              </styled.AICreditsContainer>
            </styled.AmountGrid>
          </styled.CreditsContainer>
        )}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(OverviewStep);

import {FC, ReactElement, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';
import {Hexagon} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import leonardoImage from 'static/images/leonardo.jpeg';
import aiProfileImage from 'static/images/ai_profile.jpeg';

import * as styled from './OverviewStep.styled';

interface PropsInterface {
  version: string;
  missionTitle: string;
  aiTextCreditsCount: number;
  aiImageCreditsCount: number;
  isTextAIAvailable: boolean;
  isImageAIAvailable: boolean;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onSubmitCanvas: () => void;
}

const OverviewStep: FC<PropsInterface> = ({
  version,
  missionTitle,
  aiTextCreditsCount,
  aiImageCreditsCount,
  isTextAIAvailable,
  isImageAIAvailable,
  setActiveStep,
  onRenderActions,
  onSubmitCanvas
}) => {
  const {t} = useI18n();

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
          icon: 'collect',
          disabled: true, // TODO
          label: t('labels.???'),
          onClick: () => {
            // TODO
            onSubmitCanvas();
          }
        }}
      />
    );
  }, [onRenderActions, onSubmitCanvas, setActiveStep, t]);

  return (
    <styled.Container data-testid="OverviewStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="idea" />
          <div>
            <div>{missionTitle}</div>
            <styled.Label>
              {t('labels.version', {version})} / {dateWithoutTime(new Date().toISOString())}
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
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(OverviewStep);

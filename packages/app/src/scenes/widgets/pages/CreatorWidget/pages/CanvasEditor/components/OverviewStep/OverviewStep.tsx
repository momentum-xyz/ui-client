import {FC, ReactElement, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';
import {Button, Hexagon, Input, Select, numberInputSuffixMask} from '@momentum-xyz/ui-kit';

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

        {isAIAvailable && (
          <styled.CreditsContainer>
            <styled.SubTitle>Set Max amount of contributions</styled.SubTitle>
            <styled.AmountGrid>
              <styled.SubTitle>Set amount</styled.SubTitle>
              <Select
                wide
                isClearable
                options={[]} // TODO
                value={null} // TODO
                placeholder="Contributions"
                onSingleChange={(value) => console.log(value)}
              />

              <Button wide icon="stats" variant="secondary" label="Calculate" onClick={() => {}} />
            </styled.AmountGrid>

            <styled.CreditsGrid>
              <styled.SubTitle>Expected Total of AI Credits</styled.SubTitle>
              <Input
                wide
                value={null}
                placeholder="XX AI credits"
                opts={numberInputSuffixMask('AI credits', 5, false)}
                onChange={() => {}}
              />
            </styled.CreditsGrid>
          </styled.CreditsContainer>
        )}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(OverviewStep);

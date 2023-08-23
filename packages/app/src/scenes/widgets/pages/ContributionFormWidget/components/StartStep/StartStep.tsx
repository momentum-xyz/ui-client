import {FC, ReactElement, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {ContributionStepType} from 'core/types';
import canvas from 'static/images/canvas.png';

import * as styled from './StartStep.styled';

interface PropsInterface {
  isGuest: boolean;
  setActiveStep: (step: ContributionStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onSignIn: () => void;
}

const StartStep: FC<PropsInterface> = ({isGuest, onRenderActions, setActiveStep, onSignIn}) => {
  const {t} = useI18n();

  const onStart = useCallback(() => {
    setActiveStep('answers');
  }, [setActiveStep]);

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        isSingleButton
        nextProps={{
          disabled: isGuest,
          icon: 'person_idea',
          label: t('actions.startContributing'),
          onClick: onStart
        }}
      />
    );
  }, [isGuest, onStart, onRenderActions, t]);

  const stepList: {stepNumber: string; stepTitle: string}[] = [
    {stepNumber: '1', stepTitle: t('titles.answerQuestions')},
    {stepNumber: '2', stepTitle: t('titles.addImageToContribution')},
    {stepNumber: '3', stepTitle: t('titles.checkSubmit')}
  ];

  return (
    <styled.Container data-testid="StartStep-test">
      <styled.Grid>
        <styled.Header>{t('titles.shareContribution')}</styled.Header>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </styled.Description>

        <styled.Separator />

        {isGuest && (
          <>
            <styled.Title>{t('titles.becomeMemberToContribute')}</styled.Title>
            <styled.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </styled.Description>
            <Button
              wide
              icon="astro"
              variant="secondary"
              label={t('actions.becomeMember')}
              onClick={onSignIn}
            />
            <styled.Separator />
          </>
        )}

        <styled.Title>{t('titles.titleMissionOfOdyssey')}</styled.Title>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </styled.Description>

        <styled.Separator />

        <styled.Title>{t('titles.contributionMatters')}</styled.Title>
        <styled.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </styled.Description>

        <styled.ImageContainer>
          <styled.Image src={canvas} />
        </styled.ImageContainer>
        <styled.Separator />

        <styled.Title>{t('titles.contributeSteps')}</styled.Title>
        {stepList.map((step) => (
          <styled.Step key={step.stepNumber}>
            <styled.Round>{step.stepNumber}</styled.Round>
            <span>{step.stepTitle}</span>
          </styled.Step>
        ))}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(StartStep);

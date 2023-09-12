import {FC, ReactElement, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Round} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {ContributionStepType} from 'core/types';
import {CanvasConfigInterface} from 'api/interfaces';
import canvas from 'static/images/canvas.png';

import * as styled from './StartStep.styled';

interface PropsInterface {
  isGuest: boolean;
  setActiveStep: (step: ContributionStepType) => void;
  config: CanvasConfigInterface;
  onRenderActions: (element: ReactElement) => void;
  onSignIn: () => void;
}

const StartStep: FC<PropsInterface> = ({
  isGuest,
  config,
  onRenderActions,
  setActiveStep,
  onSignIn
}) => {
  const {t} = useI18n();

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        isSingleButton
        nextProps={{
          disabled: isGuest,
          icon: 'person_idea',
          label: t('actions.startContributing'),
          onClick: () => setActiveStep('answers')
        }}
      />
    );
  }, [isGuest, setActiveStep, onRenderActions, t]);

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
          Share your ideas to the visitors of this Odyssey and create a new 3D object.
        </styled.Description>

        <styled.Separator />

        {isGuest && (
          <>
            <styled.Title>{t('titles.becomeMemberToContribute')}</styled.Title>
            <styled.Description>
              You need to connect your wallet to Odyssey to create your presence in this world.
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
        <styled.Description>{config.questionOne}</styled.Description>

        <styled.Separator />

        <styled.Title>{t('titles.contributionMatters')}</styled.Title>
        <styled.Description>
          You can add your own physical presence in this wold by contributing and sharing your
          vision.
        </styled.Description>

        <styled.ImageContainer>
          <styled.Image src={canvas} />
        </styled.ImageContainer>
        <styled.Separator />

        <styled.Title>{t('titles.contributeSteps')}</styled.Title>
        {stepList.map((step) => (
          <styled.Step key={step.stepNumber}>
            <Round label={step.stepNumber} />
            <span>{step.stepTitle}</span>
          </styled.Step>
        ))}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(StartStep);

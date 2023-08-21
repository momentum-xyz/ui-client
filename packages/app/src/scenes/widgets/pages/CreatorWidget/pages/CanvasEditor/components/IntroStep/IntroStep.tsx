import {FC, ReactElement, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import canvas from 'static/images/canvas.png';

import * as styled from './IntroStep.styled';

interface PropsInterface {
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
}

const IntroStep: FC<PropsInterface> = ({onRenderActions, setActiveStep}) => {
  const {t} = useI18n();

  const onRemoveObject = useCallback(() => {
    // TODO: Implementation
  }, []);

  const onDescribeMission = useCallback(() => {
    setActiveStep('mission');
  }, [setActiveStep]);

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          icon: 'bin',
          disabled: true,
          label: t('actions.removeObject'),
          onClick: onRemoveObject
        }}
        nextProps={{
          icon: 'rocket',
          label: t('actions.describeMission'),
          onClick: onDescribeMission
        }}
      />
    );
  }, [onDescribeMission, onRemoveObject, onRenderActions, t]);

  const stepList: {stepNumber: string; stepTitle: string}[] = [
    {stepNumber: '1', stepTitle: t('labels.canvasStep1')},
    {stepNumber: '4', stepTitle: t('labels.canvasStep4')},
    {stepNumber: '2', stepTitle: t('labels.canvasStep2')},
    {stepNumber: '5', stepTitle: t('labels.canvasStep5')},
    {stepNumber: '3', stepTitle: t('labels.canvasStep3')},
    {stepNumber: '6', stepTitle: t('labels.canvasStep6')}
  ];

  return (
    <styled.Container data-testid="IntroStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="idea" />
          <span>{t('titles.whatIsCanvas')}</span>
        </styled.Header>

        <styled.Description>{t('descriptions.canvasStep1_One')}</styled.Description>

        <styled.Separator />

        <styled.SubTitle>{t('titles.howToBuildCanvas')}</styled.SubTitle>
        <styled.Steps>
          {stepList.map((step) => (
            <styled.Step key={step.stepNumber}>
              <styled.Round>{step.stepNumber}</styled.Round>
              <span>{step.stepTitle}</span>
            </styled.Step>
          ))}
        </styled.Steps>

        <styled.Separator />

        <styled.SubTitle>{t('titles.synthesis3d')}</styled.SubTitle>
        <styled.ImageContainer>
          <styled.Image src={canvas} />
        </styled.ImageContainer>
        <styled.Description>{t('descriptions.canvasStep1_Two')}</styled.Description>

        <styled.SubTitle>{t('titles.usingAiTeamwork')}</styled.SubTitle>
        <styled.Description>{t('descriptions.canvasStep1_Three')}</styled.Description>
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(IntroStep);

import {FC, ReactElement, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, Round} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import canvas from 'static/images/canvas.png';

import * as styled from './IntroStep.styled';

interface PropsInterface {
  isNewCanvas: boolean;
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onDelete: () => void;
}

const IntroStep: FC<PropsInterface> = ({isNewCanvas, onRenderActions, setActiveStep, onDelete}) => {
  const {t} = useI18n();

  const onDescribeMission = useCallback(() => {
    setActiveStep('mission');
  }, [setActiveStep]);

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        {...(!isNewCanvas && {
          backProps: {
            icon: 'bin',
            label: t('actions.removeObject'),
            onClick: onDelete
          }
        })}
        nextProps={{
          icon: 'rocket',
          label: t('actions.describeMission'),
          onClick: onDescribeMission
        }}
      />
    );
  }, [isNewCanvas, onDelete, onDescribeMission, onRenderActions, t]);

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
              <Round label={step.stepNumber} />
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

import {FC, ReactElement, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, Round} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {CanvasStepType} from 'core/types';
import canvas from 'static/images/canvas.png';

import {CanvasStepInterface} from '../../CanvasEditor';

import * as styled from './IntroStep.styled';

interface PropsInterface {
  isNewCanvas: boolean;
  stepList: CanvasStepInterface<CanvasStepType>[];
  setActiveStep: (step: CanvasStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onDelete: () => void;
}

const IntroStep: FC<PropsInterface> = ({
  isNewCanvas,
  stepList,
  onRenderActions,
  setActiveStep,
  onDelete
}) => {
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

  return (
    <styled.Container data-testid="IntroStep-test">
      <styled.Grid>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="idea" />
          <span>{t('titles.whatIsCanvas')}</span>
        </styled.Header>

        <styled.Description>{t('descriptions.canvasStep1_One')}</styled.Description>

        <styled.Separator />

        <styled.SubTitle>{t('titles.howToBuildCanvas', {count: stepList.length})}</styled.SubTitle>
        <styled.Steps>
          {stepList.map((step) => (
            <styled.Step key={step.label}>
              <Round label={step.label || ''} />
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

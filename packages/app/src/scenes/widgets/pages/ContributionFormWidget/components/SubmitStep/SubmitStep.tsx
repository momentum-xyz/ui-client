import {FC, ReactElement, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {dateWithoutTime, getTime, useI18n} from '@momentum-xyz/core';
import {Image, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {CanvasButtonGroup} from 'ui-kit';
import {getImageAbsoluteUrl} from 'core/utils';
import {ContributionStepType} from 'core/types';
import {CanvasConfigInterface} from 'api/interfaces';
import {
  AnswersDataModelInterface,
  ImageDataModelInterface
} from 'scenes/widgets/stores/ContributionFormsStore';

import * as styled from './SubmitStep.styled';

interface PropsInterface {
  config: CanvasConfigInterface;
  imageData: ImageDataModelInterface;
  answersData: AnswersDataModelInterface;
  isSubmitting: boolean;
  setActiveStep: (step: ContributionStepType) => void;
  onRenderActions: (element: ReactElement) => void;
  onSubmit: () => void;
}

const SubmitStep: FC<PropsInterface> = ({
  config,
  imageData,
  answersData,
  isSubmitting,
  onRenderActions,
  setActiveStep,
  onSubmit
}) => {
  const {t} = useI18n();

  useEffect(() => {
    onRenderActions(
      <CanvasButtonGroup
        backProps={{
          label: t('actions.back'),
          onClick: () => setActiveStep('image')
        }}
        nextProps={{
          icon: 'person_idea',
          disabled: isSubmitting,
          label: t('labels.contribute'),
          onClick: () => onSubmit()
        }}
      />
    );
  }, [setActiveStep, isSubmitting, onRenderActions, t, onSubmit]);

  const imageSrc = useMemo(() => {
    return imageData.file
      ? URL.createObjectURL(imageData.file)
      : getImageAbsoluteUrl(imageData.fileUrlOrHash, ImageSizeEnum.S5);
  }, [imageData]);

  return (
    <styled.Container data-testid="SubmitStep-test">
      <styled.Grid>
        <styled.Header>{t('titles.submitContribution')}</styled.Header>
        <styled.Description>
          Please check the result before you create your presence in this world. And contribute when
          you’re happy!
        </styled.Description>

        <styled.Separator />

        <styled.Header>
          <span>{answersData.answerOne}</span>
          <styled.Date>
            {dateWithoutTime(new Date().toISOString())} / {getTime(new Date().toISOString())}
          </styled.Date>
        </styled.Header>

        <Image src={imageSrc} errorIcon="rabbit_fill" height={320} />

        <styled.BoldText>
          <span>{config.questionTwo}</span>
        </styled.BoldText>
        <styled.Description>{answersData.answerTwo}</styled.Description>

        <styled.BoldText>
          <span>{config.questionThree}</span>
        </styled.BoldText>
        <styled.Description>{answersData.answerThree}</styled.Description>

        {!!config.questionFour && (
          <>
            <styled.BoldText>
              <span>{config.questionFour}</span>
            </styled.BoldText>
            <styled.Description>{answersData.answerFour}</styled.Description>
          </>
        )}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(SubmitStep);

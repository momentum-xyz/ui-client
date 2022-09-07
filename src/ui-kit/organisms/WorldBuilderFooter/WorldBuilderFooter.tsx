import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {Steps} from 'ui-kit';

import * as styled from './WorldBuilderFooter.styled';

interface PropsInterface {
  currentStep?: number;
  onNext?: () => void;
  buttonLabel?: string;
  showButton?: boolean;
}

const WorldBuilderFooter: FC<PropsInterface> = ({
  currentStep,
  onNext,
  buttonLabel,
  showButton = true
}) => {
  const {t} = useTranslation();

  return (
    <styled.ButtonAndSteps>
      {showButton && (
        <styled.StyledButton label={buttonLabel ?? ''} size="large" onClick={onNext} />
      )}
      <Steps
        currentStep={currentStep}
        steps={[t('titles.name'), t('titles.template'), t('titles.generate')]}
      />
    </styled.ButtonAndSteps>
  );
};

export default WorldBuilderFooter;

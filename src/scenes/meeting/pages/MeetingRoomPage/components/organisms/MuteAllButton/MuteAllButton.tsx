import React, {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

import {SvgButton, Text} from 'ui-kit';

import * as styled from './MuteAllButton.styled';

interface PropsInterface {
  isShown: boolean;
  peopleCount: number;
  onMuteAll: () => void;
}

const MAX_STREAMS_COUNT = 2;

const MuteAllButton: FC<PropsInterface> = ({isShown, peopleCount, onMuteAll}) => {
  const {t} = useTranslation();

  if (!isShown || peopleCount <= MAX_STREAMS_COUNT) {
    return <></>;
  }

  return (
    <styled.MuteButtonContainer data-testid="MuteAllButton-test">
      <styled.MuteButton>
        <SvgButton iconName="microphoneOff" size="extra-large" onClick={onMuteAll} />
      </styled.MuteButton>
      <Text text={t('actions.muteAll')} transform="uppercase" size="xxs" />
    </styled.MuteButtonContainer>
  );
};

export default memo(MuteAllButton);

import React, {FC, memo} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';
import {IconSvg} from '../../atoms';

import * as styled from './NetworkButton.styled';

interface PropsInterface extends PropsWithThemeInterface {
  label: string;
  imageSrc?: string;
  iconName?: IconNameType;
  disabled?: boolean;
  onClick: () => void;
}

const NetworkButton: FC<PropsInterface> = (props) => {
  const {theme, label, imageSrc, iconName, disabled = false, onClick} = props;

  return (
    <styled.Button
      data-testid="NetworkButton-test"
      theme={theme}
      disabled={disabled}
      onClick={onClick}
    >
      {imageSrc && <styled.Image src={imageSrc} />}
      {iconName && <IconSvg name="profile" size="extra-large" />}
      <styled.Label>{label}</styled.Label>
    </styled.Button>
  );
};

export default memo(NetworkButton);

import {FC, memo, ReactNode} from 'react';

import {IconNameType} from '../../types';
import {ButtonRound} from '../../atoms';

import * as styled from './ProfileLine.styled';

export interface ProfileLinePropsInterface {
  icon: IconNameType;
  label: string | ReactNode;
}

const ProfileLine: FC<ProfileLinePropsInterface> = ({icon, label}) => {
  return (
    <styled.Container data-testid="ProfileLine-test">
      <ButtonRound icon={icon} isLabel />
      <span>{label}</span>
    </styled.Container>
  );
};

export default memo(ProfileLine);

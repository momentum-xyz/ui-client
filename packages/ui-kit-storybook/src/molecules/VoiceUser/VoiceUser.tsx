import {FC, memo} from 'react';
import cn from 'classnames';

import {Hexagon} from '../../atoms';

import * as styled from './VoiceUser.styled';

export interface VoiceUserPropsInterface {
  imageSrc: string;
  isActive?: boolean;
}

const VoiceUser: FC<VoiceUserPropsInterface> = ({isActive, imageSrc}) => {
  return (
    <styled.Container data-testid="VoiceUser-test" className={cn(isActive && 'active')}>
      <Hexagon type="secondary" imageSrc={imageSrc} noHover />
    </styled.Container>
  );
};

export default memo(VoiceUser);

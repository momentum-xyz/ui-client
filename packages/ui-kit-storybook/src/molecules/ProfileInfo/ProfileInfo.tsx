import {FC, memo} from 'react';

import {ButtonRound, Hexagon, IconSvg} from '../../atoms';

import * as styled from './ProfileInfo.styled';

export interface ProfileInfoPropsInterface {
  imageSrc: string;
  username: string;
  location?: string;
  isCallHidden?: boolean;
  onCallClick?: () => void;
}

const ProfileInfo: FC<ProfileInfoPropsInterface> = ({
  imageSrc,
  username,
  location,
  isCallHidden,
  onCallClick
}) => {
  return (
    <styled.Container data-testid="ProfileInfo-test">
      <styled.Hexagon>
        <Hexagon type="third-borderless" imageSrc={imageSrc} />
      </styled.Hexagon>

      <styled.TitleContainer>
        <styled.Title>{username}</styled.Title>
        {location && (
          <styled.Label>
            <IconSvg name="location" isWhite />
            <span>{location}</span>
          </styled.Label>
        )}
      </styled.TitleContainer>

      {!isCallHidden && (
        <styled.Actions>
          <ButtonRound icon="call_connect" variant="primary" onClick={onCallClick} />
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default memo(ProfileInfo);

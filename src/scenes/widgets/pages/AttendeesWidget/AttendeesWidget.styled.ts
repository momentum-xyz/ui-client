import {rgba} from 'polished';
import styled from 'styled-components';

import {ProfileWidget} from 'scenes/widgets/pages/ProfileWidget';

const PROFILE_WIDGET_X_POSITION = 549;

export const Container = styled.div`
  margin-top: 20px;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 481px;
  gap: 20px;
  padding: 0 5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
`;

export const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 5px 0;

  :hover {
    background: rgba(255, 255, 255, 10%);
  }
`;

export const AttendeeWidget = styled(ProfileWidget)`
  position: absolute;
  left: ${PROFILE_WIDGET_X_POSITION}px;
  top: 0;

  margin-left: 20px;

  background-color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
`;

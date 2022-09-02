import styled from 'styled-components';
import {rgba} from 'polished';

import {PanelLayout} from 'ui-kit/organisms';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const Section = styled(PanelLayout)`
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
  padding-bottom: 20px;
  padding-top: 10px;
  margin: 0 5px;
`;

export const Body = styled.div`
  padding: 10px 5px;
  overflow: hidden;
  height: 100%;
`;

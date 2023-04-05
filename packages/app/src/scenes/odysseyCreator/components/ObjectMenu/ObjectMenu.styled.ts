import {Heading, Text} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  border-radius: 10px;
  padding: 5px 0;
`;

export const NestedTwoLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const TitleBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  top: -38px;
  // top: -35px;
  left: 0;
`;
export const Title = styled(Heading)`
  padding: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.6)};
  // border-radius: 10px 10px 0 0;
  border-radius: 10px;
`;

export const MenuItem = styled.button`
  padding: 10px 10px;
  :nth-child(3),
  :nth-child(5),
  :nth-child(7) {
    border-right: 1px solid ${(props) => props.theme.accentText};
  }

  :disabled {
    opacity: 60%;
  }
`;

export const MenuText = styled(Text)`
  :hover,
  &.selected {
    color: ${(props) => props.theme.accentText} !important;
  }
`;

import {rgba} from 'polished';
import styled from 'styled-components';
import {IconSvg, SvgButton, Text} from '@momentum-xyz/ui-kit';

export const NextButton = styled(SvgButton)`
  transform: rotate(-90deg);
`;

export const SpaceNameText = styled(Text)`
  width: 19ch;
`;

export const Container = styled.div`
  display: flex;
  padding: 12px 10px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  align-items: center;
  gap: 10px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ClickableItem = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};

    ${NextButton} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }

    ${SpaceNameText} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }
`;

export const FavouriteIcon = styled(IconSvg)`
  margin-right: 10px;
  flex-shrink: 0;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

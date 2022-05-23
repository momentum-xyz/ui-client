import {rgba} from 'polished';
import styled from 'styled-components';

import {IconSvg, SvgButton} from 'ui-kit';

export const NextButton = styled(SvgButton)`
  transform: rotate(-90deg);
`;

export const Container = styled.div`
  display: flex;
  padding: 12px 10px;
  border-top: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  align-items: center;
  gap: 10px;
`;

export const ClickableItem = styled.button`
  display: flex;
  width: 100%;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};

    ${NextButton} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }
`;

export const FavouriteIcon = styled(IconSvg)`
  margin-right: 10px;
  flex-shrink: 0;
`;

import styled from 'styled-components';
import {rgba} from 'polished';

export const StakingCommentContainer = styled.div`
  padding: 10px 0 0 0;
`;

export const StakingComment = styled.div`
  margin: 4px 0 0 0;
  padding: 8px 10px;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  border-radius: 4px;
  font-size: var(--font-size-s);
  line-height: 18px;
`;

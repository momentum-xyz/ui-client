import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --scroll-offset: 480px;

  width: var(--widget-width-normal);
  height: var(--widget-max-height);
`;

export const Wrapper = styled.div`
  padding: 0;
`;

export const GeneralScrollable = styled.div`
  margin: 0 10px;
  display: flex;
  max-height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
`;

export const TitleContainer = styled.div`
  padding: 10px 0 0 0;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--icon-size-m);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  gap: 10px;
`;

export const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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

export const StakedInUsersContainer = styled.div`
  padding: 10px 0 0 0;
`;

export const StakedInUser = styled.div`
  margin: 10px 0 0 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;
  cursor: pointer;
  gap: 10px;
`;

export const Link = styled.a`
  font-size: var(--font-size-s);
  text-decoration: none;
`;

export const ShowAllButtonContainer = styled.div`
  padding: 10px 0 0 0;
`;

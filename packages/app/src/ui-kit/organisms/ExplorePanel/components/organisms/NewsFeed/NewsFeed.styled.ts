import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 0 0 15px 0;
  display: flex;
  flex-direction: column;
`;

export const Explore = styled.div`
  padding: 18px 10px 8px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Feed = styled.div`
  padding: 0 10px 0 10px;
  display: flex;
  flex-direction: column;
`;

export const FeedItem = styled.div`
  padding: 10px 0 4px 0;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  flex-direction: row;
  gap: 8px;
`;

export const OneAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid var(--white);
`;

export const TwoAvatarsContainer = styled.div`
  position: relative;
  width: 60px;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--white);
`;

export const AvatarAhead = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--white);
  right: 0;
`;

export const Info = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Date = styled.div`
  color: ${(props) => props.theme.accent};
  font-weight: 400;
  font-size: 8px;
`;

export const Actions = styled.div`
  padding: 2px 0 0 0;
  display: flex;
  gap: 6px;
`;

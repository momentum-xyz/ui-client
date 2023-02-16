import styled from 'styled-components';

export const TwoAvatarsContainer = styled.div`
  position: relative;
  width: 60px;
`;

export const AvatarAhead = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  right: 0;
  top: 0;
`;

export const Info = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ConnectedInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > div {
    white-space: pre;
    &.username {
      cursor: pointer;
    }
  }
`;

export const Date = styled.div`
  color: ${(props) => props.theme.accent};
  font-weight: 400;
  font-size: 8px;
`;
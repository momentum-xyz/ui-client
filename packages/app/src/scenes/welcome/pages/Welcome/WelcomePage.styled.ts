import styled from 'styled-components';
import {rgba} from 'polished';

import background from 'static/images/welcome-bg.svg';

export const Container = styled.div`
  background-image: url(${background});
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
`;

export const Card = styled.div`
  width: 282px;
  height: 360px;
  padding: 20px;

  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.9)};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};

  &.light {
    border-color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
    background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.9)};
  }
`;
export const CardHexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
  margin-top: -35px;

  & button {
    transform: scale(1.5);
  }
  &.light {
    & .hexagon {
      background: ${(props) => props.theme.accentText};
      & svg {
        color: ${(props) => props.theme.accentBg};
      }
    }
  }
`;
export const CardTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  white-space: pre-line;

  color: ${(props) => props.theme.text};
  padding-bottom: 27px;
  margin-bottom: 17px;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};

  &.light {
    color: ${(props) => props.theme.accentBg};
  }
`;
export const CardDescription = styled.h2`
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  color: ${(props) => props.theme.text};
  margin-bottom: 29px;
  white-space: pre-line;

  &.light {
    color: ${(props) => props.theme.accentBg};
  }
`;
export const CardButtonContainer = styled.h2`
  &.light {
    & button {
      color: ${(props) => props.theme.accentBg};
      border-color: ${(props) => props.theme.accentBg};
      & svg {
        color: ${(props) => props.theme.accentBg};
      }
    }
  }
`;

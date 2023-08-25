import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled.div`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 3.2px;
  font-weight: 700;

  > span {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 350px;
    white-space: nowrap;
  }
`;

export const Description = styled.div`
  line-height: 22px;
  letter-spacing: 0.28px;
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const SubTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-m);
  letter-spacing: 0.28px;
  font-weight: 500;
  line-height: 18px;
  gap: 10px;
`;

export const Date = styled.div`
  font-size: var(--font-size-s);
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.26px;
`;

import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  width: 540px;
  height: 540px;
  padding: 36px;
`;

export const Title = styled.div`
  opacity: 0.8;
`;

export const Logo = styled.img`
  margin: 30px auto 60px auto;
  height: 48px;
  width: 300px;
`;

export const Web3 = styled.div`
  margin: 14px 0 95px 0;
  position: relative;
  height: 170px;
  border-top: 1px solid ${(props) => props.theme.bg && rgba(props.theme.accent, 0.5)};
  border-bottom: 1px solid ${(props) => props.theme.bg && rgba(props.theme.accent, 0.5)};
  font-weight: 500;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 200px;
`;

export const Action = styled.div`
  &:last-child {
    text-align: right;
  }
`;

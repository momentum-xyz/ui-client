import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const Steps = styled.div`
  position: absolute;
  right: 20px;
  top: -20px;
`;

export const Title = styled.div`
  font-size: 16px;

  font-weight: 700;
  line-height: 24px;
  letter-spacing: 3.2px;
  text-transform: uppercase;
`;

export const Description = styled.div`
  line-height: 22px;
  margin-bottom: 30px;
  padding: 10px 0;
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  padding: 10px 0;
`;

export const Wrapper = styled.div`
  padding: 0;
  position: relative;
  height: 100%;
  scroll: auto;
  margin-top: 25px;
  padding: 20px;
`;

export const BuyForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

export const WalletInfo = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 20px;
  align-items: center;
`;

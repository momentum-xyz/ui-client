import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const Steps = styled.div`
  position: absolute;
  right: 0px;
  top: -32px;
`;

export const Title = styled.div`
  font-size: var(--font-size-xl);

  font-weight: 700;
  line-height: 24px;
  letter-spacing: 3.2px;
  text-transform: uppercase;

  margin-bottom: 10px;
`;

export const Title2 = styled.div`
  font-size: var(--font-size-l);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 3px;
  text-transform: uppercase;

  margin-bottom: 10px;
`;

export const Description = styled.div`
  line-height: 22px;
  padding: 10px 0;
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  margin: 20px 0;
`;

export const Section = styled.div`
  margin-bottom: 10px;
`;

export const Wrapper = styled.div`
  padding: 0;
  position: relative;
  margin-top: 25px;
  padding: 10px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WalletInfo = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 10px;
  align-items: center;
`;

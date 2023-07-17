import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div``;

export const Title = styled.div`
  padding: 10px 0 0 0;
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  line-height: 24px;
  font-weight: 700;
  letter-spacing: 0.2em;
`;

export const Filters = styled.div`
  padding: 12px 0 10px 0;
  display: grid;
  gap: 10px;
  grid-template-columns: 110px 1fr;
  align-items: center;
`;

export const RewardsContainer = styled.div`
  padding: 12px 0 10px 0;
  display: grid;
  grid-template-columns: 120px 1fr 200px;
  align-items: center;
`;

export const AirdropContainer = styled.div`
  padding: 12px 0 20px 0;
  align-items: flex-start;
  display: grid;
  grid-template-columns: 1fr 200px;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  align-items: center;
`;

export const RewardsAmount = styled.div`
  > div {
    padding: 8px 12px;
    width: 140px;
  }
`;

export const Amount = styled.div`
  > div {
    padding: 7px 12px;
    min-width: 150px;
  }
`;

export const TokenBlock = styled.div`
  padding: 20px 0 0 0;
`;

export const TitleBlock = styled.div`
  font-size: var(--font-size-s);
  text-transform: uppercase;
  line-height: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

export const TokenBlockData = styled.div`
  margin: 0 0 0 20px;
  padding: 10px 0;
  display: grid;
  grid-template-columns: 1fr auto;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  line-height: 22px;
  gap: 20px;
`;

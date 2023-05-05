import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Title = styled.div`
  padding: 10px 0;
  font-weight: 600;
  font-size: var(--font-size-m);
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const Description = styled.div`
  padding: 0 0 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  line-height: 22px;
`;

export const Section = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const Name = styled.div`
  font-weight: 600;
  font-size: var(--font-size-m);
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const SectionGrid = styled.div`
  padding: 10px 0 0 0;
  display: grid;
  grid-template-columns: 1fr 210px;
  align-items: center;
`;

export const WalletContent = styled.div`
  padding: 10px 0 0 0;
`;

export const BorderedValue = styled.div`
  padding: 0 20px;
  display: flex;
  height: 40px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  align-items: center;
  border-radius: 4px;

  > span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const Buttons = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  justify-content: flex-end;
`;

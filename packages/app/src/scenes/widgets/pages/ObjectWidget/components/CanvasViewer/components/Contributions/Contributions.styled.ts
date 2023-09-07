import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Search = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Sorting = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button {
    justify-content: left !important;
  }
`;

export const ContributionCount = styled.div`
  padding: 16px 0 0 0px;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 3.2px;
  text-transform: uppercase;
`;

export const ContributionList = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Contribution = styled.div`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  transition: all var(--tr-150-ei);

  &:hover {
    border: 1px solid ${(props) => props.theme.accentText};
    background: ${(props) => props.theme.accentBg};
  }
`;

export const ContributionInner = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
`;

export const ContributionTitle = styled.div`
  width: 340px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
`;

export const Date = styled.div`
  font-size: var(--font-size-xxs);
  letter-spacing: 0.2px;
  font-weight: 400;
`;

export const Description = styled.div`
  padding: 6px 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

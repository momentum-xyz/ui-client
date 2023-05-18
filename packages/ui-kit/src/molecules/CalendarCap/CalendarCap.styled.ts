import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  color: ${(props) => props.theme.text};
  flex-direction: row;
  gap: 10px;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Day = styled.div`
  font-size: var(--font-size-l);
  letter-spacing: 0.2em;
  font-weight: 500;
`;

export const Date = styled.div`
  font-size: var(--font-size-m);
  letter-spacing: 0.2em;
  font-weight: 400;
`;

export const Name = styled.div`
  font-size: var(--font-size-s);
  letter-spacing: 0.2em;
  font-weight: 400;
`;

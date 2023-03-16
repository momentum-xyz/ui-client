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
  overflow: hidden;
`;

export const Title = styled.div`
  font-size: var(--font-size-m);
  letter-spacing: 0.2em;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Date = styled.div`
  font-size: var(--font-size-xs);
  letter-spacing: 0.2em;
  font-weight: 400;
`;

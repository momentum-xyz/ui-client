import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  height: 50px;
  grid-template-columns: 42px 1fr 30px;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.2em;
  gap: 10px;
`;

export const Hexagon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleContainer = styled.div`
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  font-size: var(--font-size-l);
  align-self: center;
  align-items: start;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 22px;
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-m);
  text-decoration: underline;
  line-height: 20px;
  font-weight: 400;
  gap: 8px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

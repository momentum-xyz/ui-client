import styled from 'styled-components';

export const OneAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid var(--white);
  cursor: pointer;
`;

export const Info = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Date = styled.div`
  color: ${(props) => props.theme.accent};
  font-weight: 400;
  font-size: 8px;
`;

export const Actions = styled.div`
  padding: 2px 0 0 0;
  display: flex;
  gap: 6px;
`;

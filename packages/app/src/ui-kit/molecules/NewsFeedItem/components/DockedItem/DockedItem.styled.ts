import styled from 'styled-components';

export const OneAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid var(--white);
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

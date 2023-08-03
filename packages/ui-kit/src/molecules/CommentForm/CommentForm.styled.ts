import styled from 'styled-components';

export const Container = styled.div``;

export const TitleContainer = styled.div`
  display: flex;
  color: ${(props) => props.theme.text};
  flex-direction: row;
  gap: 10px;
`;

export const Title = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Name = styled.div`
  font-size: var(--font-size-s);
  letter-spacing: 1.3px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const Message = styled.div`
  padding: 3px 0 0 18px;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.28px;
  line-height: 20px;
`;

export const Actions = styled.div`
  padding: 5px 0 0 18px;
  display: flex;
  justify-content: space-between;
`;

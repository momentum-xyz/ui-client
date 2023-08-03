import styled from 'styled-components';
import {rgba} from 'polished';

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

export const Date = styled.div`
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
  font-size: var(--font-size-xxs);
  letter-spacing: 0.2px;
  line-height: 14px;
`;

export const Message = styled.div`
  padding: 3px 0 0 18px;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.28px;
  line-height: 20px;
`;

export const Actions = styled.div`
  padding: 8px 0 0 18px;
`;

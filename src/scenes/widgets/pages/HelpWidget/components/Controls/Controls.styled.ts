import styled from 'styled-components';

export const ItemRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  .IconSvg-custom {
    width: 140px;
    height: 87px;
  }
`;

export const TextItem = styled.div`
  font-size: var(--font-size-s);
`;

export const ServerSpan = styled.span`
  font-size: var(--font-size-s);
  font-weight: bold;
  text-transform: uppercase;
  color: ${(props) => props.theme.accent};
`;

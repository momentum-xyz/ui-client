import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  position: relative;
  margin: 0 -5px;

  .react-multiple-carousel__arrow {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};

    &:hover {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    }
  }
`;

export const ItemLink = styled.div`
  padding: 0 5px;

  &:hover {
    cursor: pointer;
  }
`;

export const ItemName = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  bottom: 8px;
  right: 5px;
  left: 5px;

  > span {
    padding: 0 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

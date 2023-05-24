import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-name-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0)};
  --lg-name-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};

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
  height: 30px;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, var(--lg-name-from) 0%, var(--lg-name-to) 100%);
  color: ${(props) => props.theme.text};
  border-radius: 0px 0px 4px 4px;
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  bottom: 0;
  right: 5px;
  left: 5px;

  > span {
    padding: 0 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

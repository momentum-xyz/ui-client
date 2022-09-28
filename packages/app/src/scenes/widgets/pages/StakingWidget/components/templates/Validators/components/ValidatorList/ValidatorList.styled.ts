import styled from 'styled-components';
import {rgba} from 'polished';

export const ValidatorListContainer = styled.div`
  display: block;
  width: 100%;
  min-width: 250px;
  line-height: 1;
  background: transparent;

  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xs);
  font-weight: 400;

  overflow: auto;
  height: 100%;
`;

export const ValidatorListTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
      background: ${(props) => props.theme.bg};
      padding: 5px;
      text-align: left;
      vertical-align: middle;
      color: ${(props) => props.theme.accent};
      font-size: var(--font-size-s);
      font-weight: 400;
      text-transform: uppercase;
      line-height: 1;

      &.clickable {
        cursor: pointer;
      }
    }
  }

  thead tr th {
    position: sticky;
    top: 0;
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background: ${rgba(0, 1, 1, 0.2)};
      }
    }
    td {
      padding: 5px;
      text-align: left;
      vertical-align: middle;

      &.small-column {
        width: 30px;
      }

      &.truncate {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 1px;
      }

      &.clickable {
        cursor: pointer;
      }

      &.indent {
        padding-left: 20px;
      }

      &.selected {
        font-weight: 700;
      }
    }
  }
`;

export const THContainter = styled.div`
  display: flex;
  align-items: center;
`;

import styled from 'styled-components';
import {rgba} from 'polished';

export const TokenRuleListContainer = styled.div`
  display: block;
  width: 100%;
  line-height: 1;
  background: transparent;
  max-height: 725px;
  text-transform: uppercase;
  overflow: scroll;

  color: ${(props) => props.theme.text};
  font-size: 14px;
  font-weight: 500;

  &.approved {
    color: ${(props) => props.theme.accent};
  }

  &.declined {
    color: ${(props) => props.theme.accentDanger};
  }
  &.requested {
    color: white;
  }
`;

export const Span = styled.span`
  &.approved {
    color: ${(props) => props.theme.accent};
    text-transform: capitalize;
  }

  &.declined {
    color: ${(props) => props.theme.accentDanger};
    text-transform: capitalize;
  }
  &.requested {
    color: white;
    text-transform: capitalize;
  }
`;

export const TokenRuleListTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
      background: ${(props) => props.theme.bg};
      padding: 5px;
      text-align: left;
      vertical-align: middle;
      color: ${(props) => props.theme.accent};
      font-size: 12px;
      font-weight: 700;
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
    // tr {
    //   &:nth-child(odd) {
    //     background: ${rgba(0, 1, 1, 0.2)};
    //   }
    // }

    td {
      padding: 5px;
      text-align: left;
      vertical-align: middle;

      &:first-child {
        padding-left: 20px;
      }

      &:last-child {
        padding-right: 20px;
      }

      &.small-column {
        width: 30px;
      }

      &.clickable {
        cursor: pointer;
      }
      &.info {
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

export const NoTokensMessage = styled.div`
  display: flex;
  padding: 20px;
  justify-content: center;
`;

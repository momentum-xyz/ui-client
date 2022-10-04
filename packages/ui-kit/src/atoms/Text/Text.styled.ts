import styled from 'styled-components';

export const Text = styled.div`
  color: ${(props) => props.theme.text};
  white-space: pre-line;

  &.xxs {
    font-size: var(--font-size-xxs);
  }

  &.xs {
    font-size: var(--font-size-xs);
  }

  &.s {
    font-size: var(--font-size-s);
  }

  &.m {
    font-size: var(--font-size-m);
  }

  &.l {
    font-size: var(--font-size-l);
  }

  &.xl {
    font-size: var(--font-size-xl);
  }

  &.xxl {
    font-size: var(--font-size-xxl);
  }

  &.xxxl {
    font-size: var(--font-size-xxxl);
  }

  &.transform-normal {
    text-transform: none;
  }

  &.transform-capitalized {
    text-transform: capitalize;
  }

  &.transform-uppercase {
    text-transform: uppercase;
  }

  &.transform-lowercase {
    text-transform: lowercase;
  }

  &.singleLine {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &.breakLongWord {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  &.left {
    text-align: left;
  }

  &.right {
    text-align: right;
  }

  &.center {
    text-align: center;
  }

  &.justify {
    text-align: justify;
  }

  &.weight-light {
    font-weight: 300;
  }

  &.weight-normal {
    font-weight: normal;
  }

  &.weight-medium {
    font-weight: 500;
  }

  &.weight-bold {
    font-weight: bold;
  }

  &.weight-bolder {
    font-weight: bolder;
  }

  &.noWrap {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BoldSpan = styled.span`
  font-weight: bold;
`;

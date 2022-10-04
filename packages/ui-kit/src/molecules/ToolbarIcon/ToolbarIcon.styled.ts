import styled from 'styled-components';
import {rgba} from 'polished';
import {Transition} from '@headlessui/react';

import {SvgButton} from '../../molecules';

export const ActiveSvgButton = styled(SvgButton)``;

export const StyledTransition = styled(Transition)`
  cursor: pointer;

  &.visible,
  .visible {
    transform: translateY(0);
  }

  &.not-visible,
  .not-visible {
    transform: translateY(60px);
  }

  &.animate,
  .animate {
    transition: all 300ms linear;
  }

  .active {
    ${ActiveSvgButton} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)} !important;
    }
  }
`;

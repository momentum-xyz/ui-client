import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --next-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
`;

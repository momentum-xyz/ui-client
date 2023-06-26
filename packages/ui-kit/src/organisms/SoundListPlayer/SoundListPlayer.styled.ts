import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Title = styled.div`
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
`;

export const TracksWrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  border-radius: 4px;
  gap: 10px;
`;

export const TrackBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

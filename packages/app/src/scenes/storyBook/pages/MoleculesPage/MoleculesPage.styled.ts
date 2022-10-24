import styled from 'styled-components';
import {rgba} from 'polished';

export const Div = styled.div`
  display: grid;
  grid-gap: 10px;
`;

export const Components = styled.div`
  height: calc(100vh - 140px);
  overflow: auto;
`;

export const Name = styled.div`
  padding: 10px 20px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.6)};
  border-radius: 10px;
`;

export const Section = styled.div`
  position: relative;
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionGrid3 = styled.div`
  margin: 15px 0;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  display: grid;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionGrid2 = styled.div`
  margin: 15px 0;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  display: grid;
  flex-wrap: wrap;
  gap: 12px;
`;

export const AvatarImageUpload = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background: var(--black-100);
  position: relative;
`;

export const TileImageUpload = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background: var(--black-100);
  position: relative;
`;

export const CenteredItem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

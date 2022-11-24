import styled from 'styled-components';

export const UniverseMapContainer = styled.div`
  background: repeating-radial-gradient(
    circle at center,
    #3d4a6d,
    #3d4a6d 52px,
    #336778,
    #336778 55px
  );
  width: 100%;
  height: 100%;
`;

export const WorldItem = styled.div<{size: number; x: number; y: number}>`
  position: absolute;
  top: ${({y}) => y}%;
  left: ${({x}) => x}%;
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #fff;
  border: 3px solid white;
`;

export const WorldItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

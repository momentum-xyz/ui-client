import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;
export const SkyboxInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PreviewHolder = styled.div`
  position: relative;
  width: 100%;
`;

export const SkyboxTitle = styled.div`
  width: 100%;
  font-weight: 700;
  font-size: 16px;
  margin: 10px 0 0 0;
  letter-spacing: 0.2em;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const SkyboxInfoLine = styled.div``;
export const ControlsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 20px 0;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  gap: 20px;
  width: 100%;
`;
export const Prop = styled.div`
  display: flex;
  // justify-content: space-between;
  align-items: center;
  flex: 1;
  letter-spacing: 0.02em;
  line-height: 22px;

  & > div {
    max-width: 254px;
  }
`;
export const PropName = styled.span`
  margin-right: 5px;
  width: 120px;
`;
export const PropValue = styled.span`
  font-weight: 700;
`;

import styled from 'styled-components';

export const Background = styled.div<{background: string}>`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url(${(props) => props.background});
  align-items: center;
  justify-content: center;
  z-index: var(--base-z-index);
`;

export const PanelContent = styled.div`
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px;
`;

export const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  margin-right: 25px;
  margin-left: 5px;
  padding: 10px;
`;

export const ActionsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
  margin-top: 10px;
`;

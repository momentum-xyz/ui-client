import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 20px 20px 0 20px;
  pointer-events: none;
`;

// export const UsersContainer = styled.div`
//   display: flex;
//   gap: 10px;
//   height: 100%;
// `;
//
export const PanelWrapper = styled.div`
  height: 100%;

  &.voiceChatOpen {
    transform: translateX(-300px);
  }
`;

// export const Rejoin = styled.div`
//  position: absolute;
//  pointer-events: all;
//  right: 222px;
//  top: 12px;
// `;

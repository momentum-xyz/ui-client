import styled from 'styled-components';

export const ActiveStake = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 10px 3px;
  border-bottom: 1px solid rgba(1, 255, 179, 0.2);
  color: ${(props) => props.theme.text};
`;

export const StakeColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;
export const WithdrawColumn = styled(StakeColumn)`
  flex: 0.4;
`;

export const StopStaking = styled(StakeColumn)`
  flex: 0.45;
`;

export const DetailsColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 7px;
  cursor: pointer;
`;

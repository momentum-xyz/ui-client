import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  overflow: hidden;
  max-height: calc(100% - 50px);
  width: 400px;
  margin-top: 10px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  width: 80px;
  height: max-content;
  gap: 10px;
  padding-bottom: 5px;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Info = styled.div`
  display: flex;
  gap: 5px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  &.restricted {
    .Text-custom {
      max-width: 9ch;
    }
  }
`;

export const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60px;
`;

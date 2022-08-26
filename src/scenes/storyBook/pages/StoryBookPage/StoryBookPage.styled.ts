import styled from 'styled-components';

export const Item = styled.div`
  width: max-content;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;

  ${Item} ~ ${Item} {
    margin-left: 10px;
  }
`;

export const SectionTitle = styled.h1`
  font-size: 25px;
  font-weight: bolder;
`;

export const ItemName = styled.p`
  width: 100%;
  text-align: left;
  padding: 0 10px 5px;
`;

export const Section = styled.section`
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  padding: 20px;
  width: 100%;
  flex-grow: 1;

  ${SectionTitle} {
    margin-bottom: 10px;
  }

  ${Row} ~ ${Row} {
    margin-top: 10px;
  }
`;

export const Div = styled.div`
  text-align: center;

  &.main {
    height: calc(100vh);
    width: calc(100vw);
    padding: 20px 0;
    z-index: 100;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    background: gray;
  }

  &.sampleWidth {
    width: 200px;
    background: transparent;

    div ~ div {
      margin-top: 10px;
    }
  }

  ${Section} ~ ${Section} {
    margin-top: 20px;
  }
`;

export const Space = styled.div`
  margin-right: 175px;
  margin-top: 200px;
`;

export const RequestButtonsExample = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
`;

export const RequestExample = styled.div`
  width: 303px;
`;

export const InputPanelLayout = styled.div`
  .Input-custom ~ .TextArea-custom {
    margin-top: 10px;
  }
`;

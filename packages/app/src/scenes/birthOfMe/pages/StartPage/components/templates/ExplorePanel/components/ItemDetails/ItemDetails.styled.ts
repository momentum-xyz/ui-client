import {rgba} from 'polished';
import styled from 'styled-components';
import {Heading, IconSvg} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const BackIconSvg = styled(IconSvg)`
  transform: rotate(90deg);
  color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.7)};
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 10px 10px 5px 10px;
`;

export const FlyToButtonContainer = styled.div`
  width: 100%;
  padding: 10px 0;
`;

export const SubSpacesHeading = styled(Heading)`
  padding: 10px;
  display: flex;
  align-items: center;
  flex-basis: 0;
  opacity: 90%;
`;

export const ParentHeading = styled(Heading)`
  opacity: 0.7;
`;

export const Header = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  cursor: pointer;
  color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};

  :hover {
    ${ParentHeading} {
      opacity: 1;
    }

    ${BackIconSvg} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }
`;

export const SubspacesContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const SubspaceList = styled.div`
  overflow-y: auto;
`;

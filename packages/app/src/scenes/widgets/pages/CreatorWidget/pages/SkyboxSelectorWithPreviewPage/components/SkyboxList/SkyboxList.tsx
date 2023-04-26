import {Frame} from '@momentum-xyz/ui-kit-storybook';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxList.styled';

export interface PropsInterface {
  skyboxes: Asset3dInterface[];
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
}

export const SkyboxList = ({skyboxes, onSkyboxSelect}: PropsInterface): JSX.Element => {
  console.log('skyboxes', skyboxes);

  return (
    <styled.Container>
      {skyboxes.length &&
        skyboxes.map((sb) => (
          <styled.SkyboxContainer key={sb.id} onClick={() => onSkyboxSelect(sb)}>
            <Frame>
              <styled.SkyboxInnerContainer>
                <img src={sb.image} alt="" />
                <span>{sb.name}</span>
              </styled.SkyboxInnerContainer>
            </Frame>
          </styled.SkyboxContainer>
        ))}
    </styled.Container>
  );
};

import {Frame, Loader, Image} from '@momentum-xyz/ui-kit-storybook';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxList.styled';

interface PropsInterface {
  skyboxes: Asset3dInterface[];
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
}

export const SkyboxList = ({skyboxes, onSkyboxSelect}: PropsInterface): JSX.Element => {
  console.log('skyboxes', skyboxes);

  return (
    <styled.Container>
      {!!skyboxes.length &&
        skyboxes.map((sb) => (
          <styled.SkyboxContainer key={sb.id} onClick={() => onSkyboxSelect(sb)}>
            <Frame>
              <styled.SkyboxInnerContainer>
                <Image src={sb.image} height={160} bordered />
                <span>{sb.name}</span>
              </styled.SkyboxInnerContainer>
            </Frame>
          </styled.SkyboxContainer>
        ))}
      {!skyboxes.length && <Loader />}
    </styled.Container>
  );
};

import {FC} from 'react';
import {Frame, Loader, Image, ButtonRound} from '@momentum-xyz/ui-kit';

import {Asset3dInterface} from 'core/models';

import * as styled from './SkyboxList.styled';

interface PropsInterface {
  isMySkyboxes: boolean;
  skyboxes: Asset3dInterface[];
  onSkyboxSelect: (skybox: Asset3dInterface) => void;
  onSkyboxDelete: (skyboxId: string) => void;
}

export const SkyboxList: FC<PropsInterface> = ({
  skyboxes,
  isMySkyboxes,
  onSkyboxSelect,
  onSkyboxDelete
}) => {
  console.log('skyboxes', skyboxes);

  return (
    <styled.Container data-testid="SkyboxList-test">
      {!!skyboxes.length &&
        skyboxes.map((sb) => (
          <styled.SkyboxContainer key={sb.id}>
            <Frame>
              <styled.SkyboxInnerContainer onClick={() => onSkyboxSelect(sb)}>
                <Image src={sb.image} height={140} bordered />
                <styled.SkyboxName>{sb.name}</styled.SkyboxName>
              </styled.SkyboxInnerContainer>
            </Frame>

            {isMySkyboxes && (
              <styled.RemoveIcon>
                <ButtonRound icon="bin" onClick={() => onSkyboxDelete(sb.id)} />
              </styled.RemoveIcon>
            )}
          </styled.SkyboxContainer>
        ))}
      {!skyboxes.length && <Loader />}
    </styled.Container>
  );
};

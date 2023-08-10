import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Loader, Image, ButtonRound, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {SkyboxItemModelType} from 'core/models';

import * as styled from './SkyboxList.styled';

interface PropsInterface {
  isLoading: boolean;
  isMySkyboxes: boolean;
  skyboxes: SkyboxItemModelType[];
  onSkyboxSelect: (skybox: SkyboxItemModelType) => void;
  onSkyboxDelete: (skyboxId: string) => void;
}

const SkyboxList: FC<PropsInterface> = ({
  skyboxes,
  isLoading,
  isMySkyboxes,
  onSkyboxSelect,
  onSkyboxDelete
}) => {
  return (
    <styled.Container data-testid="SkyboxList-test">
      <styled.Inner>
        {!!skyboxes.length &&
          skyboxes.map((sb) => (
            <styled.SkyboxContainer key={sb.id}>
              <Frame>
                <styled.SkyboxInnerContainer onClick={() => onSkyboxSelect(sb)}>
                  <Image src={getImageAbsoluteUrl(sb.id, ImageSizeEnum.S4)} height={140} bordered />
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
      </styled.Inner>

      {isLoading && skyboxes.length === 0 && (
        <styled.SkyboxLoader>
          <Loader />
        </styled.SkyboxLoader>
      )}
    </styled.Container>
  );
};

export default observer(SkyboxList);

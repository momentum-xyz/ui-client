import {FC, memo, useMemo} from 'react';
import {ListChildComponentProps} from 'react-window';
import {ButtonRound, Frame, Image, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {SkyboxItemModelType} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './SkyboxGroupRow.styled';

type SkyboxGroupRowType = {
  isMySkyboxes: boolean;
  items: SkyboxItemModelType[][];
  onSkyboxSelect: (skybox: SkyboxItemModelType) => void;
  onSkyboxDelete: (skyboxId: string) => void;
};

const SkyboxGroupRow: FC<ListChildComponentProps> = ({index, style, data}) => {
  const typedData = data as SkyboxGroupRowType;

  const entryGroup = useMemo(() => {
    return typedData.items[index];
  }, [typedData, index]);

  if (!entryGroup) {
    return <></>;
  }

  return (
    <div style={style} data-testid="SkyboxGroupRow-test">
      <styled.Inner>
        {entryGroup.map((sb) => (
          <styled.SkyboxContainer key={sb.id}>
            <Frame>
              <styled.SkyboxInnerContainer onClick={() => typedData.onSkyboxSelect(sb)}>
                <Image src={getImageAbsoluteUrl(sb.id, ImageSizeEnum.S4)} height={140} bordered />
                <styled.SkyboxName>{sb.name}</styled.SkyboxName>
              </styled.SkyboxInnerContainer>
            </Frame>

            {typedData.isMySkyboxes && (
              <styled.RemoveIcon>
                <ButtonRound icon="bin" onClick={() => typedData.onSkyboxDelete(sb.id)} />
              </styled.RemoveIcon>
            )}
          </styled.SkyboxContainer>
        ))}
      </styled.Inner>
    </div>
  );
};

export default memo(SkyboxGroupRow);

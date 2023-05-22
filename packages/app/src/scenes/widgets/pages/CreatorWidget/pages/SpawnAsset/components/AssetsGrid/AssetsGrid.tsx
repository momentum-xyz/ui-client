import {FC, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/odyssey3d';
import {Frame, Image} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {Asset3dInterface} from 'core/models';

import * as styled from './AssetsGrid.styled';

interface PropsInterface {
  assets: Asset3dInterface[];
  showPreview?: boolean;
  onSelected: (asset: Asset3dInterface) => void;
}

const AssetGrid: FC<PropsInterface> = ({assets, showPreview, onSelected}) => {
  const [hoveringAsset, setHoveringAsset] = useState<Asset3dInterface | null>(null);

  const {t} = useI18n();

  const ref = useRef<HTMLDivElement>(null);

  if (assets.length === 0) {
    return (
      <styled.EmptyResult>
        <styled.ObjectName>{t('messages.noResultsFound')}</styled.ObjectName>
      </styled.EmptyResult>
    );
  }

  return (
    <styled.Grid ref={ref}>
      {assets.map((asset) => (
        <styled.GridItem
          key={asset.id}
          onPointerOver={() => {
            setHoveringAsset(asset);
          }}
          onPointerLeave={() => {
            setHoveringAsset(null);
          }}
        >
          <Frame>
            <styled.GridItemInnerContainer onClick={() => onSelected(asset)}>
              {hoveringAsset !== asset || !showPreview ? (
                <Image src={asset.previewUrl} height={140} bordered />
              ) : (
                <styled.GridItemPreview>
                  <Model3dPreview
                    previewUrl={asset.previewUrl}
                    delayLoadingMsec={500}
                    filename={hoveringAsset.thumbnailAssetDownloadUrl}
                  />
                </styled.GridItemPreview>
              )}
              {/* <Text text={asset.name} size="m" breakLongWord /> */}
              <styled.ObjectName>{asset.name}</styled.ObjectName>
            </styled.GridItemInnerContainer>
          </Frame>
        </styled.GridItem>
      ))}
    </styled.Grid>
  );
};

export default observer(AssetGrid);

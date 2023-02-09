import {Button, Text} from '@momentum-xyz/ui-kit';
import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/map3d';

import {Asset3dInterface} from 'core/models';

import * as styled from './AssetsGrid.styled';

interface PropsInterface {
  assets: Asset3dInterface[];
  showPreview?: boolean;
  onSelected: (asset: Asset3dInterface) => void;
}

const AssetGrid: FC<PropsInterface> = ({assets, showPreview, onSelected}) => {
  const [hoveringAsset, setHoveringAsset] = useState<Asset3dInterface | null>(null);

  const {t} = useTranslation();

  if (assets.length === 0) {
    return (
      <styled.EmptyResult>
        <Text text={t('messages.noResultsFound')} size="xs" />
      </styled.EmptyResult>
    );
  }

  return (
    <styled.Grid>
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
          {hoveringAsset !== asset || !showPreview ? (
            <styled.GridItemImage src={asset.previewUrl} />
          ) : (
            <styled.GridItemPreview>
              <Model3dPreview
                previewUrl={asset.previewUrl}
                delayLoadingMsec={500}
                filename={hoveringAsset.thumbnailAssetDownloadUrl}
              />
            </styled.GridItemPreview>
          )}
          <Text text={asset.name} size="m" breakLongWord />
          <Button
            label={t('actions.select')}
            size="medium"
            onClick={() => {
              onSelected(asset);
            }}
          />
        </styled.GridItem>
      ))}
    </styled.Grid>
  );
};

export default observer(AssetGrid);

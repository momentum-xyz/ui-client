import {Button, Text} from '@momentum-xyz/ui-kit';
import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {Model3dPreview} from '@momentum-xyz/map3d';

import {Asset3dInterface} from 'core/models';

import * as styled from './AssetsGrid.styled';

interface PropsInterface {
  assets: Asset3dInterface[];
  onSelected: (asset: Asset3dInterface) => void;
}

const AssetGrid: FC<PropsInterface> = ({assets, onSelected}) => {
  const {t} = useTranslation();
  const [hoveringAsset, setHoveringAsset] = useState<Asset3dInterface | null>(null);

  return (
    <styled.Grid>
      {assets.map((asset) => (
        <styled.GridItem
          key={asset.id}
          onPointerOver={() => {
            console.log('enter');
            setHoveringAsset(asset);
          }}
          onPointerLeave={() => {
            console.log('leave');
            setHoveringAsset(null);
          }}
        >
          {hoveringAsset !== asset ? (
            <styled.GridItemImage src={asset.image} />
          ) : (
            <styled.GridItemPreview>
              <Model3dPreview
                delayLoadingMsec={500}
                filename={hoveringAsset.thumbnailAssetDownloadUrl}
              />
            </styled.GridItemPreview>
          )}
          <Text text={asset.name} size="m" />
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

import {Button, Text} from '@momentum-xyz/ui-kit';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Asset3dInterface} from 'core/models';

import * as styled from './AssetsGrid.styled';

interface PropsInterface {
  assets: Asset3dInterface[];
  onSelected: (asset: Asset3dInterface) => void;
}

const AssetGrid: FC<PropsInterface> = ({assets, onSelected}) => {
  const {t} = useTranslation();

  return (
    <styled.Grid>
      {assets.map((asset) => (
        <styled.GridItem key={asset.id}>
          <styled.GridItemImage src={asset.image} />
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

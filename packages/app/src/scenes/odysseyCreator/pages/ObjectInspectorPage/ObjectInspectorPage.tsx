import {FC} from 'react';
import {observer} from 'mobx-react-lite';
// import {useI18n} from '@momentum-xyz/core';
// import {Button, Input } from '@momentum-xyz/ui-kit-storybook';
import {Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
// import {Asset3dCategoryEnum} from 'api/enums';

import * as styled from './ObjectInspectorPage.styled';
import {ObjectColorPicker} from './components';

const ObjectInspector: FC = () => {
  const {odysseyCreatorStore} = useStore();
  const {selectedObjectId, objectName, objectInfo} = odysseyCreatorStore;

  console.log('ObjectInspector.tsx: selected asset: ', {selectedObjectId, objectName, objectInfo});
  // const {t} = useI18n();

  return (
    <styled.Container>
      <styled.Section>
        <Text text={objectName} size="xxl" align="left" transform="uppercase" />
        <div>TODO preview</div>
      </styled.Section>
      <styled.Separator />
      <styled.Section>
        <div>TODO transform inputs</div>
        {/* <Input
          placeholder={t('labels.search')}
          isSearch
          isClearable
          wide
          onChange={spawnAssetStore.searchQuery.setQuery}
          value={spawnAssetStore.searchQuery.query}
        /> */}
      </styled.Section>
      <styled.Section>
        <ObjectColorPicker />
      </styled.Section>
    </styled.Container>
  );
};

export default observer(ObjectInspector);

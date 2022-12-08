import {Dropdown, Heading, PanelLayout, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';

import {useStore} from 'shared/hooks';

import * as styled from './EditObject.styled';

const EditObject: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderObjectStore} = worldBuilderStore;

  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    worldBuilderObjectStore.fetchObject(objectId);
  }, [objectId, worldBuilderObjectStore]);

  return (
    <styled.Wrapper>
      <styled.Container>
        <PanelLayout
          title={t('titles.selectFunctionality')}
          headerIconName="blocks"
          headerType="h2"
          iconSize="medium"
        >
          <styled.PanelBody>
            <styled.HeadingWrapper>
              <Heading
                label={t('labels.selectFunction')}
                type="h2"
                align="left"
                transform="uppercase"
              />
              <Text text={t('messages.selectOne')} size="s" align="left" />
            </styled.HeadingWrapper>
            <Dropdown
              value={worldBuilderObjectStore.currentAssetId}
              options={Object.entries(worldBuilderObjectStore.assets2D).map(([key, value]) => ({
                label: value,
                value: key
              }))}
              placeholder={t('placeholders.selectAnOption')}
              onOptionSelect={async (option) => {
                worldBuilderObjectStore.selectAsset(option.value);
                await worldBuilderObjectStore.updateObject();
              }}
              variant="secondary"
            />
          </styled.PanelBody>
        </PanelLayout>
      </styled.Container>
    </styled.Wrapper>
  );
};

export default observer(EditObject);

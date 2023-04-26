// import {Dropdown, Heading, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useEffect, useRef, useState} from 'react';
// import {useI18n} from '@momentum-xyz/core';
import {Button, TabInterface, Tabs} from '@momentum-xyz/ui-kit-storybook';

import {BasicAsset2dIdEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {ChangeImageDialog, ChangeTextDialog} from 'scenes/object/components';

import * as styled from './ObjectFunctionalityPage.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: 'Picture'},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: 'Video'},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: 'Text'}
];

const ObjectFunctionalityPage: FC = () => {
  const {creatorStore} = useStore();
  const {objectFunctionalityStore, selectedObjectId} = creatorStore;

  const [modifiedOptionValue, setModifiedOptionValue] = useState<string | null>(null);

  const isModified =
    !!modifiedOptionValue && modifiedOptionValue !== objectFunctionalityStore.currentAssetId;

  const activeId = modifiedOptionValue || objectFunctionalityStore.currentAssetId;

  const actionRef = useRef<{doSave: () => void}>({doSave: () => {}});

  const renderBody = () => {
    switch (activeId) {
      case BasicAsset2dIdEnum.IMAGE:
        return <ChangeImageDialog actionRef={actionRef} />;
      case BasicAsset2dIdEnum.VIDEO:
        return <div>TODO</div>;
      case BasicAsset2dIdEnum.TEXT:
        return <ChangeTextDialog actionRef={actionRef} />;
      default:
        return null;
    }
  };

  console.log('ObjectFunctionalityPage', {
    selectedObjectId,
    isModified,
    modifiedOptionValue,
    currentAssetId: objectFunctionalityStore.currentAssetId
  });

  // const {t} = useI18n();

  // TODO remove this and simplify the store
  useEffect(() => {
    if (selectedObjectId) {
      objectFunctionalityStore.init(selectedObjectId);
    }

    return () => {
      objectFunctionalityStore.resetModel();
    };
  }, [selectedObjectId, objectFunctionalityStore]);

  const handleSave = async () => {
    if (!modifiedOptionValue) {
      return;
    }

    try {
      actionRef.current.doSave();

      objectFunctionalityStore.selectAsset(modifiedOptionValue);
      await objectFunctionalityStore.updateObject();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <styled.Container>
      <styled.HeadingWrapper>
        <Tabs tabList={TABS_LIST} activeId={activeId} onSelect={setModifiedOptionValue} />
      </styled.HeadingWrapper>

      <styled.PanelBody>{renderBody()}</styled.PanelBody>

      <styled.ActionBar>
        <Button disabled={!isModified} label="Embed" onClick={handleSave} />
      </styled.ActionBar>
    </styled.Container>
  );
};

export default observer(ObjectFunctionalityPage);

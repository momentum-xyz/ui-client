import {Dropdown, Heading, PanelLayout, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import {useStore} from 'shared/hooks';

import * as styled from './EditObject.styled';

const EditObject: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderObjectStore} = worldBuilderStore;

  return (
    <styled.Wrapper>
      <styled.Container>
        <PanelLayout title="Select Functionality" headerIconName="cubicles">
          <styled.PanelBody>
            <Heading label="Select Function" type="h2" align="left" />
            <Text text="Select one" size="s" align="left" />
            <Dropdown
              options={Object.entries(worldBuilderObjectStore.assets2D).map(([key, value]) => ({
                label: value,
                value: key
              }))}
              placeholder="Select an option"
              onOptionSelect={async (option) => {
                await worldBuilderObjectStore.updateAsset2d(option.value);
              }}
            />
          </styled.PanelBody>
        </PanelLayout>
      </styled.Container>
    </styled.Wrapper>
  );
};

export default observer(EditObject);

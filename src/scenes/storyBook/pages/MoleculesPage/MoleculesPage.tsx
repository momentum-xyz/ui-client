import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';

import {appVariables} from 'api/constants';
import {UserStatusEnum} from 'core/enums';
import {
  AccentColorList,
  Avatar,
  ColorPicker,
  Dropdown,
  ExpandableLayout,
  Heading,
  Location,
  PageTopBar
} from 'ui-kit';

import * as styled from './MoleculesPage.styled';

const avatarSrc = `${appVariables.RENDER_SERVICE_URL}/get/2c192ae7cf19a1a782258d07278af61b`;

const MoleculesPage: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Molecules" />
      <styled.Components>
        <styled.Name>
          <Heading label="Component «Avatar»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Avatar size="large" />
          <Avatar size="large" avatarSrc={avatarSrc} />
          <Avatar size="large" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="large" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
          <Avatar size="normal" />
          <Avatar size="normal" avatarSrc={avatarSrc} />
          <Avatar size="normal" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="normal" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
          <Avatar size="small" />
          <Avatar size="small" avatarSrc={avatarSrc} />
          <Avatar size="small" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="small" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ColorPicker»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <ColorPicker
            name="Accent Color"
            selectedColor={theme.accent}
            colors={AccentColorList}
            onColorSelect={() => {}}
            theme={theme}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Dropdown»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <Dropdown
            placeholder="Primary select ..."
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1'},
              {label: 'option 2', value: 'option-2'},
              {label: 'option 3', value: 'option-3'}
            ]}
          />
          <Dropdown
            placeholder="Secondary select ..."
            variant="secondary"
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1', icon: 'star'},
              {label: 'option 2', value: 'option-2', icon: 'search'},
              {label: 'option 3', value: 'option-3', icon: 'starOn'}
            ]}
          />
          <Dropdown
            placeholder="Secondary select ..."
            variant="secondary"
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1'},
              {label: 'option 2', value: 'option-2'},
              {label: 'option 3', value: 'option-3'}
            ]}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «ExpandableLayout»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <ExpandableLayout
            name="People"
            iconName="people"
            isExpanded={expanded}
            setExpand={() => setExpanded(!expanded)}
            size={{width: '250px'}}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book.
          </ExpandableLayout>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Location»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <Location icon="locate" value={avatarSrc} />
        </styled.SectionGrid3>
      </styled.Components>
    </styled.Div>
  );
};

export default MoleculesPage;

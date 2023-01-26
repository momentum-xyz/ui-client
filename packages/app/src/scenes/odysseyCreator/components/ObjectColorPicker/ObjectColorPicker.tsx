import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {ColorPicker, useColor} from 'react-color-palette';
import {Dialog} from '@momentum-xyz/ui-kit';

import 'react-color-palette/lib/css/styles.css';

import * as styled from './ObjectColorPicker.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const ObjectColorPicker: FC = () => {
  // FIXME: Get color
  const [color, setColor] = useColor('hex', '#FFFFFF');

  const {t} = useTranslation();

  return (
    <Dialog
      icon="blocks"
      iconSize="normal"
      position="leftTop"
      title={t('titles.colourPicker')}
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      showBackground={false}
      headerStyle="normal"
      headerType="h3"
      noPadding
      shortTopPadding
      layoutSize={{width: '300px'}}
      onClose={() => {}}
      showCloseButton
    >
      <styled.Container data-testid="ObjectColorPicker-test">
        <ColorPicker
          width={300}
          height={150}
          color={color}
          onChange={setColor}
          hideHSV
          hideHEX
          hideRGB
        />

        <styled.ColorContainer>
          <styled.SelectedColor background={color.hex} />
          <styled.SelectedHex>{color.hex}</styled.SelectedHex>
        </styled.ColorContainer>
      </styled.Container>
    </Dialog>
  );
};

export default observer(ObjectColorPicker);

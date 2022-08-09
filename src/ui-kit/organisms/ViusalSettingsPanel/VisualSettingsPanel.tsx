import React, {FC} from 'react';

import {
  Heading,
  ColorPicker,
  PanelLayout,
  AccentColorList,
  PropsWithThemeInterface,
  getBackgroundColorByAccent
} from 'ui-kit';

import * as styled from './VisualSettingsPanel.styled';

interface PropsInterface extends PropsWithThemeInterface {
  onAccentColorSelect: (color: string) => void;
  onBackgroundColorSelect: (color: string) => void;
}

const VisualSettingsPanel: FC<PropsInterface> = ({
  theme,
  onAccentColorSelect,
  onBackgroundColorSelect
}) => {
  if (!theme) {
    return null;
  }

  return (
    <PanelLayout theme={theme}>
      <styled.ColorControls data-testid="VisualSettingsPanel-test">
        <styled.ColorControlsTitle>
          <Heading type="h2" theme={theme} label="Visual Settings" align="center" />
        </styled.ColorControlsTitle>
        <styled.ColorControl>
          <ColorPicker
            name="Accent Color"
            selectedColor={theme.accent}
            colors={AccentColorList}
            onColorSelect={onAccentColorSelect}
            theme={theme}
          />
        </styled.ColorControl>
        <styled.ColorControl>
          <ColorPicker
            name="Panel Color"
            selectedColor={theme.bg}
            colors={getBackgroundColorByAccent(theme)}
            onColorSelect={onBackgroundColorSelect}
          />
        </styled.ColorControl>
      </styled.ColorControls>
    </PanelLayout>
  );
};

export default VisualSettingsPanel;

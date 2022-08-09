import React, {FC} from 'react';
import cn from 'classnames';

import {Text} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './ColorPicker.styled';

interface PropsInterface extends PropsWithThemeInterface {
  name: string;
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: FC<PropsInterface> = ({theme, name, colors, onColorSelect, selectedColor}) => {
  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  return (
    <styled.Container data-testid="ColorPicker-test">
      <Text size="xxs" text={name} transform="uppercase" weight="bold" />
      <styled.ColorContainer>
        {colors.map((color, index) => (
          <styled.Color
            theme={theme}
            key={index}
            color={color}
            onClick={() => handleColorSelect(color)}
            className={cn(selectedColor === color && 'selected')}
          />
        ))}
      </styled.ColorContainer>
    </styled.Container>
  );
};

export default ColorPicker;

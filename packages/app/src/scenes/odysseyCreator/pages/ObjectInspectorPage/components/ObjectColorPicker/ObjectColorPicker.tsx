import {useDebouncedCallback} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {ColorPicker, useColor, toColor} from 'react-color-palette';

import {useStore} from 'shared/hooks';

import * as styled from './ObjectColorPicker.styled';

import 'react-color-palette/lib/css/styles.css';

const COLOR_PICKER_DEFAULT_COLOR = '#FFFFFF';
const COLOR_PICKER_HEIGHT_PX = 250;
const COLOR_PICKER_WIDTH_PX = 300; // override with css
const DEBOUNCE_DELAY_MS = 300;

const ObjectColorPage: FC = () => {
  const {odysseyCreatorStore, universeStore} = useStore();
  const {objectColorStore} = odysseyCreatorStore;
  const {world3dStore} = universeStore;

  const objectId = odysseyCreatorStore.selectedObjectId || '';

  const [color, setColor] = useColor('hex', COLOR_PICKER_DEFAULT_COLOR);

  // TODO move these to parent
  const changeUnityObjectColor = useDebouncedCallback((colorHex: string) => {
    world3dStore?.colorPickedPreview(objectId, colorHex);
    objectColorStore.updateObjectColor(objectId, color.hex);
  }, DEBOUNCE_DELAY_MS);

  useEffect(() => {
    objectColorStore.init(objectId);

    return () => {
      objectColorStore.resetModel();
    };
  }, [objectId, objectColorStore]);

  useEffect(() => {
    if (objectColorStore.objectColor) {
      setColor(toColor('hex', objectColorStore.objectColor));
    }
  }, [objectColorStore.objectColor, setColor]);

  // const onSaveHandler = useCallback(async () => {
  //   await objectColorStore.updateObjectColor(objectId, color.hex);
  //   world3dStore?.colorPickedPreview(objectId, color.hex);
  // }, [color.hex, objectColorStore, objectId, universeStore, world3dStore]);

  // const onCancelHandler = useCallback(() => {
  //   const initialColor = objectColorStore.objectColor || COLOR_PICKER_DEFAULT_COLOR;
  //   world3dStore?.colorPickedPreview(objectId, initialColor);
  // }, [ objectColorStore.objectColor, objectId, world3dStore, universeStore.worldId]);

  return (
    <styled.Container data-testid="ObjectColorPage-test">
      <ColorPicker
        width={COLOR_PICKER_WIDTH_PX}
        height={COLOR_PICKER_HEIGHT_PX}
        color={color}
        hideHSV
        hideHEX
        hideRGB
        onChange={(color) => {
          setColor(color);
          changeUnityObjectColor(color.hex);
        }}
      />

      <styled.ColorContainer>
        <styled.SelectedColor background={color.hex} />
        <styled.SelectedHex>{color.hex}</styled.SelectedHex>
        {/* <Button
                size="medium"
                variant="danger"
                label={t('actions.cancel')}
                onClick={onCancelHandler}
              />
              <Button size="medium" label={t('actions.save')} onClick={onSaveHandler} /> */}
      </styled.ColorContainer>
    </styled.Container>
  );
};

export default observer(ObjectColorPage);

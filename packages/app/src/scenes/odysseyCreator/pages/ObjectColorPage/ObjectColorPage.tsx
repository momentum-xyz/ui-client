import {Button, Dialog, useClickOutside, useDebouncedCallback} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import React, {FC, useCallback, useEffect, useRef} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import {ColorPicker, useColor, toColor} from 'react-color-palette';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectColorPage.styled';

import 'react-color-palette/lib/css/styles.css';

const COLOR_PICKER_DEFAULT_COLOR = '#FFFFFF';
const COLOR_PICKER_HEIGHT_PX = 150;
const COLOR_PICKER_WIDTH_PX = 300;
const UNITY_DELAY_MS = 300;
const OFFSET_LEFT = 10;
const OFFSET_TOP = 20;

const ObjectColorPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {objectColorStore} = odysseyCreatorStore;
  const {unityInstanceStore} = unityStore;

  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useColor('hex', COLOR_PICKER_DEFAULT_COLOR);

  const {objectId} = useParams<{objectId: string}>();
  const navigate = useNavigate();
  const {t} = useI18n();

  useClickOutside(ref, () => {
    navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  });

  const changeUnityObjectColor = useDebouncedCallback((colorHex: string) => {
    unityInstanceStore.colorPickedPreview(objectId, colorHex);
  }, UNITY_DELAY_MS);

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

  const onSaveHandler = useCallback(async () => {
    await objectColorStore.updateObjectColor(objectId, color.hex);
    unityInstanceStore.colorPickedPreview(objectId, color.hex);
    navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  }, [color.hex, navigate, objectColorStore, objectId, unityStore, unityInstanceStore]);

  const onCancelHandler = useCallback(() => {
    const initialColor = objectColorStore.objectColor || COLOR_PICKER_DEFAULT_COLOR;
    unityInstanceStore.colorPickedPreview(objectId, initialColor);
    navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  }, [navigate, objectColorStore.objectColor, objectId, unityInstanceStore, unityStore.worldId]);

  return (
    <styled.Wrapper>
      <styled.WrapperInner>
        <Dialog
          icon="blocks"
          iconSize="normal"
          position="leftTop"
          title={t('titles.colourPicker')}
          offset={{left: OFFSET_LEFT, top: OFFSET_TOP}}
          layoutSize={{width: `${COLOR_PICKER_WIDTH_PX}px`}}
          showBackground={false}
          headerStyle="normal"
          headerType="h3"
          showCloseButton
          noPadding
          shortTopPadding
          onClose={onCancelHandler}
        >
          <styled.Container ref={ref} data-testid="ObjectColorPage-test">
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
              <Button
                size="medium"
                variant="danger"
                label={t('actions.cancel')}
                onClick={onCancelHandler}
              />
              <Button size="medium" label={t('actions.save')} onClick={onSaveHandler} />
            </styled.ColorContainer>
          </styled.Container>
        </Dialog>
      </styled.WrapperInner>
    </styled.Wrapper>
  );
};

export default observer(ObjectColorPage);

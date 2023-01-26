import {Button, Dialog, useClickOutside} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import React, {FC, useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {ColorPicker, useColor, toColor} from 'react-color-palette';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectColorPage.styled';

import 'react-color-palette/lib/css/styles.css';

const DEFAULT_COLOR = '#FFFFFF';
const OFFSET_LEFT = 10;
const OFFSET_TOP = 20;

const ObjectColorPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {objectColorStore} = odysseyCreatorStore;

  const [color, setColor] = useColor('hex', DEFAULT_COLOR);

  const {objectId} = useParams<{objectId: string}>();

  const history = useHistory();
  const ref = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();

  useClickOutside(ref, () => {
    history.push(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  });

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

  const onClose = useCallback(() => {
    history.push(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  }, [history, unityStore.worldId]);

  return (
    <styled.Wrapper>
      <styled.WrapperInner>
        <Dialog
          icon="blocks"
          iconSize="normal"
          position="leftTop"
          title={t('titles.colourPicker')}
          offset={{left: OFFSET_LEFT, top: OFFSET_TOP}}
          showBackground={false}
          headerStyle="normal"
          headerType="h3"
          noPadding
          shortTopPadding
          layoutSize={{width: '300px'}}
          onClose={onClose}
          showCloseButton
        >
          <styled.Container ref={ref} data-testid="ObjectColorPage-test">
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
              <Button
                size="medium"
                variant="danger"
                label={t('actions.cancel')}
                onClick={onClose}
              />
              <Button
                size="medium"
                label={t('actions.save')}
                onClick={() => {
                  objectColorStore.updateObjectColor(objectId, color.hex);
                  onClose();
                }}
              />
            </styled.ColorContainer>
          </styled.Container>
        </Dialog>
      </styled.WrapperInner>
    </styled.Wrapper>
  );
};

export default observer(ObjectColorPage);

import React, {FC} from 'react';
import {Control} from 'react-hook-form/dist/types/form';
import {FieldErrors} from 'react-hook-form/dist/types/errors';
import {Controller} from 'react-hook-form';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {TileFormInterface} from 'api';
import {Input} from 'ui-kit';
import {YOUTUBE_URL_PLACEHOLDER} from 'core/constants';
import {TileInterface} from 'core/models';

import * as styled from './VideoTileForm.styled';

interface PropsInterface {
  control: Control<TileFormInterface, any>;
  errors: FieldErrors;
  currentTile: TileInterface | null;
}

const VideoTileForm: FC<PropsInterface> = ({control, errors, currentTile}) => {
  return (
    <styled.Item>
      <styled.TextItem>
        <Controller
          name="youtube_url"
          control={control}
          defaultValue={currentTile ? currentTile?.content?.url : ''}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <Input
              label={t('dashboard.tileForm.videoLabel')}
              value={value}
              onChange={onChange}
              placeholder={YOUTUBE_URL_PLACEHOLDER}
              isError={!!errors.youtube_url}
              isCustom
            />
          )}
        />
      </styled.TextItem>
    </styled.Item>
  );
};

export default observer(VideoTileForm);

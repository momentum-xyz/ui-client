import React, {FC} from 'react';
import {Controller} from 'react-hook-form';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {Control} from 'react-hook-form/dist/types/form';
import {FieldErrors} from 'react-hook-form/dist/types/errors';

import {TileFormInterface} from 'api';
import {Input, TextArea} from 'ui-kit';
import {TileInterface} from 'core/models';

import * as styled from './TextTileForm.styled';

interface PropsInterface {
  control: Control<TileFormInterface, any>;
  errors: FieldErrors;
  currentTile: TileInterface | null;
}

const TextTileForm: FC<PropsInterface> = ({control, errors, currentTile}) => {
  return (
    <styled.Item>
      <styled.TextItem>
        <Controller
          name="text_title"
          control={control}
          defaultValue={currentTile ? currentTile?.content?.title : ''}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <Input
              label={t('dashboard.tileForm.textLabel')}
              value={value}
              onChange={onChange}
              isError={!!errors.text_title}
              placeholder={t('dashboard.tileForm.textPlaceholder')}
              isCustom
            />
          )}
        />
      </styled.TextItem>
      <styled.TextItem>
        <Controller
          name="text_description"
          control={control}
          defaultValue={currentTile ? currentTile?.content?.text : ''}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <TextArea
              name={t('dashboard.tileForm.descriptionLabel')}
              value={value}
              onChange={onChange}
              placeholder={t('dashboard.tileForm.descriptionPlaceholder')}
              isError={!!errors.text_description}
              isResizable={true}
            />
          )}
        />
      </styled.TextItem>
    </styled.Item>
  );
};

export default observer(TextTileForm);

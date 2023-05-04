import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Input} from '@momentum-xyz/ui-kit-storybook';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';

import * as styled from './ObjectTransformForm.styled';

export interface TransformInterface {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

interface PropsInterface {
  data: TransformInterface;
  onTransformChange: (data: TransformInterface) => void;
}

const ObjectInspector: FC<PropsInterface> = ({data, onTransformChange}) => {
  const {t} = useI18n();

  const {control, handleSubmit} = useForm<TransformInterface>({defaultValues: data});

  const handleChange: SubmitHandler<TransformInterface> = (data) => {
    console.log('ObjectInspector handleChange', data);

    const dataWithNumbers = Object.keys(data).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = Number(data[key]) || 0;
      return acc;
    }, {} as TransformInterface);

    onTransformChange(dataWithNumbers);
  };

  return (
    <styled.Container className="ObjectTransformFormContainer">
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.scale')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>W</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="scaleX"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>H</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="scaleY"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>D</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="scaleZ"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
        </styled.ControlsRowInputsContainer>
      </styled.ControlsRow>
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.position')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>X</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="positionX"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>Y</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="positionY"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>Z</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="positionZ"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
        </styled.ControlsRowInputsContainer>
      </styled.ControlsRow>
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.rotation')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>X</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="rotationX"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>Y</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="rotationY"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
          <styled.ControlsRowInputContainer>
            <styled.ControlsRowInputTitle>Z</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name="rotationZ"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChange={(d) => {
                    onChange(d);
                    handleSubmit(handleChange)();
                  }}
                />
              )}
            />
          </styled.ControlsRowInputContainer>
        </styled.ControlsRowInputsContainer>
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(ObjectInspector);

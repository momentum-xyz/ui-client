import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Input, numberInputMask} from '@momentum-xyz/ui-kit';
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
  initialData: TransformInterface;
  onTransformChange: (data: TransformInterface) => void;
}

const ObjectTransformForm: FC<PropsInterface> = ({initialData, onTransformChange}) => {
  const {t} = useI18n();

  const {control, handleSubmit} = useForm<TransformInterface>({defaultValues: initialData});

  const handleChange: SubmitHandler<TransformInterface> = (data) => {
    console.log('ObjectInspector handleChange', data);

    const dataWithNumbers = Object.keys(data).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = parseFloat(data[key]);
      return acc;
    }, {} as TransformInterface);

    onTransformChange(dataWithNumbers);
  };

  const row = (title: string, inputNames: [string, keyof TransformInterface][]) => (
    <styled.ControlsRow>
      <styled.ControlsRowTitle>{title}</styled.ControlsRowTitle>
      <styled.ControlsRowInputsContainer>
        {inputNames.map(([label, name]) => (
          <styled.ControlsRowInputContainer key={name}>
            <styled.ControlsRowInputTitle>{label}</styled.ControlsRowInputTitle>
            <Controller
              control={control}
              name={name}
              rules={{required: true}}
              render={({field: {value, onChange}}) => {
                const valStr = String(value);
                return (
                  <Input
                    value={valStr}
                    opts={numberInputMask(10)}
                    onChange={(d) => {
                      onChange(d);
                      if (d !== valStr) {
                        handleSubmit(handleChange)();
                      }
                    }}
                  />
                );
              }}
            />
          </styled.ControlsRowInputContainer>
        ))}
      </styled.ControlsRowInputsContainer>
    </styled.ControlsRow>
  );

  return (
    <styled.Container className="ObjectTransformForm-test">
      {row(t('titles.scale'), [
        ['W', 'scaleX'],
        ['H', 'scaleY'],
        ['D', 'scaleZ']
      ])}
      {row(t('titles.position'), [
        ['X', 'positionX'],
        ['Y', 'positionY'],
        ['Z', 'positionZ']
      ])}
      {row(t('titles.rotation'), [
        ['X', 'rotationX'],
        ['Y', 'rotationY'],
        ['Z', 'rotationZ']
      ])}
    </styled.Container>
  );
};

export default observer(ObjectTransformForm);

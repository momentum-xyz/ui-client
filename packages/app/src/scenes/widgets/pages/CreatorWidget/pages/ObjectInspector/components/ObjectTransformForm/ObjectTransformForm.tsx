import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Input, numberInputMask, numberInputSuffixMask} from '@momentum-xyz/ui-kit';

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

const DECIMALS = 3;

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

  const scaleInputs: [string, keyof TransformInterface][] = [
    ['W', 'scaleX'],
    ['H', 'scaleY'],
    ['D', 'scaleZ']
  ];

  const positionInputs: [string, keyof TransformInterface][] = [
    ['X', 'positionX'],
    ['Y', 'positionY'],
    ['Z', 'positionZ']
  ];

  const rotationInputs: [string, keyof TransformInterface][] = [
    ['X', 'rotationX'],
    ['Y', 'rotationY'],
    ['Z', 'rotationZ']
  ];

  return (
    <styled.Container className="ObjectTransformForm-test">
      {/* SCALE INPUTS */}
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.scale')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          {scaleInputs.map(([label, name]) => (
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
                      opts={numberInputMask(DECIMALS, false)}
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

      {/* POSITION INPUTS */}
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.position')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          {positionInputs.map(([label, name]) => (
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
                      opts={numberInputMask(DECIMALS, true)}
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

      {/* ROTATION INPUTS */}
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.rotation')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          {rotationInputs.map(([label, name]) => (
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
                      opts={numberInputSuffixMask('°', DECIMALS, true)}
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
    </styled.Container>
  );
};

export default observer(ObjectTransformForm);

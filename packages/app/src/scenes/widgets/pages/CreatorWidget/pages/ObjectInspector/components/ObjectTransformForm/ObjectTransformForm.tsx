import {FC} from 'react';
import IMask from 'imask';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Input, numberInputMask, numberInputSuffixMask} from '@momentum-xyz/ui-kit';

import {MathUtils} from 'core/utils';
import {ObjectTransformFormInterface} from 'core/interfaces';

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
const truncate = (num: number | null, decimals = DECIMALS) => {
  if (!num) {
    return num;
  }
  const x = Math.pow(10, decimals);
  return Math.trunc(num * x) / x;
};

const ObjectTransformForm: FC<PropsInterface> = ({initialData, onTransformChange}) => {
  const {t} = useI18n();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<ObjectTransformFormInterface>({
    defaultValues: {
      ...initialData,
      rotationX: MathUtils.radiansToDegrees(initialData.rotationX),
      rotationY: MathUtils.radiansToDegrees(initialData.rotationY),
      rotationZ: MathUtils.radiansToDegrees(initialData.rotationZ)
    }
  });

  const scaleInputs: [string, keyof ObjectTransformFormInterface][] = [
    ['W', 'scaleX'],
    ['H', 'scaleY'],
    ['D', 'scaleZ']
  ];

  const positionInputs: [string, keyof ObjectTransformFormInterface][] = [
    ['X', 'positionX'],
    ['Y', 'positionY'],
    ['Z', 'positionZ']
  ];

  const rotationInputs: [string, keyof ObjectTransformFormInterface][] = [
    ['X', 'rotationX'],
    ['Y', 'rotationY'],
    ['Z', 'rotationZ']
  ];

  const handleChange: SubmitHandler<ObjectTransformFormInterface> = (form) => {
    console.log('[ObjectInspector] HandleChange form', form);
    const data: TransformInterface = {
      scaleX: form.scaleX || 0,
      scaleY: form.scaleY || 0,
      scaleZ: form.scaleZ || 0,
      positionX: form.positionX || 0,
      positionY: form.positionY || 0,
      positionZ: form.positionZ || 0,
      rotationX: MathUtils.degreesToRadians(form.rotationX || 0),
      rotationY: MathUtils.degreesToRadians(form.rotationY || 0),
      rotationZ: MathUtils.degreesToRadians(form.rotationZ || 0)
    };

    console.log('[ObjectInspector] HandleChange data', data);
    onTransformChange(data);
  };

  const renderController = (
    fieldName: keyof ObjectTransformFormInterface,
    mask: IMask.AnyMaskedOptions
  ) => {
    return (
      <Controller
        name={fieldName}
        control={control}
        rules={{required: true}}
        render={({field: {value, onChange}}) => {
          const valStr = String(truncate(value, DECIMALS));
          return (
            <Input
              opts={mask}
              value={valStr}
              danger={!!errors[fieldName]}
              onChange={(d) => {
                onChange(d !== '' ? Number(d) : null);
                if (d !== valStr) {
                  handleSubmit(handleChange)();
                }
                if (d === '') {
                  setError(fieldName, {message: 'invalid'});
                }
              }}
            />
          );
        }}
      />
    );
  };

  return (
    <styled.Container className="ObjectTransformForm-test">
      {/* SCALE INPUTS */}
      <styled.ControlsRow>
        <styled.ControlsRowTitle>{t('titles.scale')}</styled.ControlsRowTitle>
        <styled.ControlsRowInputsContainer>
          {scaleInputs.map(([label, name]) => (
            <styled.ControlsRowInputContainer key={name}>
              <styled.ControlsRowInputTitle>{label}</styled.ControlsRowInputTitle>
              {renderController(name, numberInputMask(DECIMALS, false))}
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
              {renderController(name, numberInputMask(DECIMALS, true))}
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
              {renderController(name, numberInputSuffixMask('°', DECIMALS, true, 360, -360))}
            </styled.ControlsRowInputContainer>
          ))}
        </styled.ControlsRowInputsContainer>
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(ObjectTransformForm);

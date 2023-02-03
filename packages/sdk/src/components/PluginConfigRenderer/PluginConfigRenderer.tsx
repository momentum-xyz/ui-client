import {Button, Heading, Input, PanelLayout, Text, Toggle} from '@momentum-xyz/ui-kit';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';

import {PluginConfigDescriptionInterface} from '../../interfaces';

import * as styled from './PluginConfigRenderer.styled';

interface PropsInterface {
  config: PluginConfigDescriptionInterface;
  defaultValue?: unknown;
  onSave: (data: unknown) => void;
  onCancel: () => void;
}

const generateDefaultValues = (config: PluginConfigDescriptionInterface) => {
  const defaultValues: Record<string, unknown> = {};
  Object.keys(config).forEach((key) => {
    const item = config[key];
    if (item.type === 'boolean') {
      defaultValues[key] = item.defaultValue || false;
    } else if (item.type === 'number') {
      defaultValues[key] = item.defaultValue || 0;
    } else {
      defaultValues[key] = item.defaultValue || '';
    }
  });
  return defaultValues;
};

export const PluginConfigRenderer: React.FC<PropsInterface> = ({
  config,
  defaultValue,
  onSave,
  onCancel
}) => {
  const {
    formState: {errors},
    handleSubmit,
    control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm({defaultValues: defaultValue ?? (generateDefaultValues(config) as any)});

  const onSubmit = (data: Record<string, unknown>) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PanelLayout title="Plugin config" onClose={onCancel}>
        <styled.PluginConfigRendererContainer>
          {Object.keys(config).map((key) => {
            const item = config[key];
            const error = errors[key];
            return (
              <div key={key}>
                <Controller
                  control={control}
                  name={key}
                  rules={{required: item.required}}
                  render={({field: {value, onChange}}) => {
                    return (
                      <styled.ItemContainer>
                        <Heading
                          type="h4"
                          label={item.displayName || key}
                          align="left"
                          transform="uppercase"
                        />

                        {item.type === 'boolean' ? (
                          <Toggle checked={value || false} onChange={onChange} />
                        ) : (
                          <Input
                            value={value || ''}
                            type={item.type === 'number' ? 'number' : 'text'}
                            isError={!!error}
                            errorMessage={error?.message}
                            onChange={onChange}
                          />
                        )}

                        {item.description && (
                          <styled.Description>
                            <Text text={item.description} size="s" align="left" />
                          </styled.Description>
                        )}
                      </styled.ItemContainer>
                    );
                  }}
                />
              </div>
            );
          })}
          <styled.ButtonsContainer>
            <Button submit label="Save" />
            <Button submit={false} label="Cancel" onClick={onCancel} />
          </styled.ButtonsContainer>
        </styled.PluginConfigRendererContainer>
      </PanelLayout>
    </form>
  );
};

export default PluginConfigRenderer;

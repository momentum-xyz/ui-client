import React, {FC, useEffect} from 'react';
import {Button, FileUploader, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

import {Box} from 'ui-kit';
import {SignUpFormInterface} from 'core/interfaces';
import {FieldErrorInterface} from 'api/interfaces';

import * as styled from './CreateOdysseyForm.styled';

interface PropsInterface {
  isSubmitDisabled: boolean;
  fieldErrors: FieldErrorInterface[];
  onSubmit: (form: SignUpFormInterface) => void;
}

const CreateOdysseyForm: FC<PropsInterface> = (props) => {
  const {fieldErrors, isSubmitDisabled: disabled, onSubmit} = props;

  const {t} = useTranslation();

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpFormInterface>();

  const onUpdateProfile = handleSubmit((data: SignUpFormInterface) => {
    onSubmit(data);
  });

  useEffect(() => {
    fieldErrors.forEach(({fieldName, errorMessage}) => {
      setError(fieldName as keyof SignUpFormInterface, {type: 'duplicate', message: errorMessage});
    });
  }, [fieldErrors, setError]);

  return (
    <Box>
      <styled.Div>
        <Text size="m" text="2. Mint your Odyssey" align="left" />
        <Text size="m" text="Choose an image for your odyssey" align="left" />

        <Controller
          name="avatar"
          control={control}
          render={({field: {value, onChange}}) => (
            <styled.Avatar>
              <styled.AvatarImageUpload>
                {value && <styled.ImagePreview src={URL.createObjectURL(value)} />}
                <styled.AvatarImageInner>
                  <FileUploader
                    label="Upload Image"
                    dragActiveLabel="Drop the files here..."
                    fileType="image"
                    buttonSize="medium"
                    onFilesUpload={onChange}
                    onError={(error) => console.error(error)}
                    enableDragAndDrop={false}
                  />
                </styled.AvatarImageInner>
              </styled.AvatarImageUpload>
            </styled.Avatar>
          )}
        />

        <Text size="m" text="What should we call you?" align="left" />
        <styled.ImageContainer>
          <IconSvg name="profile" size="large" />
          <Controller
            name="name"
            control={control}
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {onChange, value}}) => (
              <InputDark
                variant="secondary"
                placeholder="Choose your name"
                value={value || ''}
                disabled={disabled}
                isError={!!errors.name}
                errorMessage={
                  errors?.name?.type !== 'duplicate'
                    ? t('errors.nameConstraints')
                    : errors.name.message
                }
                onChange={onChange}
              />
            )}
          />
        </styled.ImageContainer>

        <Text
          size="m"
          text="All set, let’s go! Create an NFT with your personal odyssey"
          align="left"
        />
        <Button
          size="medium"
          label="Create your Odyssey"
          icon="planet"
          disabled={disabled}
          onClick={onUpdateProfile}
        />
      </styled.Div>
    </Box>
  );
};

export default CreateOdysseyForm;

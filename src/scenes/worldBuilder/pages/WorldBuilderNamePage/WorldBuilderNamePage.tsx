import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {WorldBuilderFooter, WorldBuilderHeader} from 'scenes/worldBuilder/components';
import {useStore} from 'shared/hooks';
import {Text, Page} from 'ui-kit';
import {slugify} from 'core/utils';
import {appVariables} from 'api/constants';
import background from 'static/images/worldBuilder.png';

import * as styled from './WorldBuilderNamePage.styled';

interface WorldNameFormInterface {
  name: string;
  subdomainName: string;
}

const WorldBuilderNamePage: FC = () => {
  const {worldNameStore} = useStore().worldBuilderStore;
  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    handleSubmit,
    setValue,
    setError,
    clearErrors
  } = useForm<WorldNameFormInterface>({
    defaultValues: {
      name: '',
      subdomainName: ''
    }
  });

  const formSubmitHandler: SubmitHandler<WorldNameFormInterface> = async (
    data: WorldNameFormInterface
  ) => {
    const {valid: nameIsValid, error: nameError} = await worldNameStore.validateName(data.name);
    const {valid: subdomainIsValid, error: subdomainError} =
      await worldNameStore.validateSubdomainName(data.subdomainName);

    if (nameIsValid && subdomainIsValid) {
      // TODO: redirect to next step
      console.info('Redirecting to template...');
      return;
    }

    if (nameError) {
      setError('name', {
        message: nameError
      });
    }

    if (subdomainError) {
      setError('subdomainName', {
        message: subdomainError
      });
    }
  };

  const handleNameChange = (onChange: (name: string) => void) => {
    return (name: string) => {
      onChange(name);
      clearErrors();

      setValue('subdomainName', slugify(name));
    };
  };

  const handleSubdomainNameChange = (onChange: (subdomainName: string) => void) => {
    return (subdomainName: string) => {
      onChange(slugify(subdomainName));
      clearErrors();
    };
  };

  const domain = appVariables.IS_DEV_ENVIRONMENT ? 'odyssey.ninja' : 'momentum.xyz';

  return (
    <Page backgroundSrc={background}>
      <styled.Container>
        <styled.Spacer />
        <WorldBuilderHeader />
        <styled.FormContainer>
          <styled.FormFieldContainer>
            <styled.InputLabel
              label={t('labels.nameWorld')}
              transform="uppercase"
              type="h1"
              align="right"
            />
            <Controller
              name="name"
              control={control}
              render={({field: {value, onChange}}) => (
                <styled.InputStyled
                  value={value}
                  type="dark"
                  placeholder={t('placeholders.nameYourWorld')}
                  errorMessage={errors.name?.message}
                  onChange={handleNameChange(onChange)}
                  isError={!!errors.name}
                />
              )}
            />
            <Text text={t('descriptions.worldName')} size="xl" align="left" />
          </styled.FormFieldContainer>
          <styled.FormFieldContainer>
            <styled.InputLabel
              label={t('labels.subdomain')}
              transform="uppercase"
              type="h1"
              align="right"
            />
            <Controller
              name="subdomainName"
              control={control}
              render={({field: {value, onChange}}) => (
                <styled.InputStyled
                  type="dark"
                  placeholder={t('placeholders.worldname')}
                  value={value}
                  onChange={handleSubdomainNameChange(onChange)}
                  errorMessage={errors.subdomainName?.message}
                  isError={!!errors.subdomainName}
                />
              )}
            />
            <Text text={t('descriptions.worldSubdomain')} size="xl" align="left" />
          </styled.FormFieldContainer>
          <styled.FormFieldContainer>
            <styled.InputLabel
              label={t('labels.worldURL')}
              transform="uppercase"
              type="h1"
              align="right"
            />
            <Controller
              name="subdomainName"
              control={control}
              render={({field: {value}}) => (
                <styled.InputStyled
                  type="dark"
                  placeholder={`${t('placeholders.worldname')}.${domain}`}
                  value={value + (value && `.${domain}`)}
                  disabled
                />
              )}
            />
            <Text text={t('descriptions.worldURL')} size="xl" align="left" />
          </styled.FormFieldContainer>
        </styled.FormContainer>
        <WorldBuilderFooter
          currentStep={0}
          buttonLabel={t('actions.selectTemplate')}
          onNext={handleSubmit(formSubmitHandler)}
        />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderNamePage);

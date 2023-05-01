import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {SubmitHandler, Controller, useForm} from 'react-hook-form';
import DatePickerOriginal, {ReactDatePickerProps} from 'react-datepicker';
import cn from 'classnames';
import {Input, Dialog, TextArea} from '@momentum-xyz/ui-kit';
import {DATE_TIME_FORMAT, timeFromNow, useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
//import {NewsfeedTypeEnum} from 'core/enums';
import {EventFormInterface} from 'core/interfaces';
import {ToastContent} from 'ui-kit';

import * as styled from './EventForm.styled';

const DatePicker = DatePickerOriginal as unknown as FC<ReactDatePickerProps>;

const EventForm: FC = () => {
  const {t} = useI18n();
  const {widgetsStore, universeStore, sessionStore} = useStore();
  const {calendarStore} = widgetsStore;
  const {eventForm, formDialog, eventList} = calendarStore;
  const {currentEvent} = eventForm;

  const {
    control,
    formState: {errors},
    handleSubmit,
    setValue,
    setError,
    clearErrors
  } = useForm<EventFormInterface>();
  const [image, setImage] = useState<File>();
  const [startDate, setStartDate] = useState<Date>(() => {
    if (currentEvent?.eventId) {
      return currentEvent.start;
    } else {
      return new Date();
    }
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    if (currentEvent?.eventId) {
      return currentEvent.end;
    } else {
      return timeFromNow(1);
    }
  });

  const formSubmitHandler: SubmitHandler<EventFormInterface> = async (data: EventFormInterface) => {
    if (!data.web_link?.length) {
      data.web_link = null;
    }

    //const isNewEvent = !eventForm.currentEvent;
    const isSuccess = await eventForm.createOrUpdateEvent(
      data,
      universeStore.worldId,
      sessionStore.userId,
      calendarStore.world?.name,
      image
    );

    //const nft = nftStore.getNftByUuid(universeStore.worldId);

    {
      /*if (isSuccess && isNewEvent && nft) {
      await exploreStore.createNewsfeedItem({
        uuid: nft.uuid,
        type: NewsfeedTypeEnum.CALENDAR,
        date: new Date().toISOString(),
        calendar: {
          id: eventForm.eventId || '',
          image: eventForm.imageHash || '',
          start: data.start.toISOString(),
          end: data.end.toISOString(),
          title: data.title
        }
      });
    }*/
    }

    if (isSuccess) {
      formDialog.close();
      toast.info(
        <ToastContent
          icon="alert"
          title={t('titles.alert')}
          text={t('eventForm.createSuccess')}
          showCloseButton
        />
      );
      await eventList.fetchSpaceEvents(universeStore.worldId);
    } else {
      toast.error(
        <ToastContent
          isDanger
          icon="alert"
          title={t('titles.alert')}
          text={t('eventForm.createFailed')}
          showCloseButton
        />
      );
    }
  };

  const handleStartDate = (date: Date) => {
    if (date && date >= new Date()) {
      setStartDate(date);
      const end = new Date(date);
      end.setHours(end.getHours() + 1);
      setEndDate(end);
    }
  };

  const handleEndDate = (date: Date) => {
    if (date && date > startDate) {
      setEndDate(date);
    }
  };

  const handleImage = (file: File | undefined) => {
    setImage(file);
  };

  useEffect(() => {
    return () => eventForm.resetModel();
  }, [eventForm]);

  useEffect(() => {
    if (startDate >= endDate) {
      setError('end', {message: t('errors.endDateGraterThanStartDate') || ''});
      return;
    } else {
      clearErrors('end');
    }
    setValue('start', startDate);
    setValue('end', endDate);
  }, [clearErrors, endDate, setError, setValue, startDate]);

  return (
    <Dialog
      title={currentEvent?.eventId ? t('eventForm.editTitle') : t('eventForm.addTitle')}
      headerStyle="uppercase"
      showCloseButton
      onClose={formDialog.close}
      approveInfo={{
        title: currentEvent?.eventId ? 'update' : 'submit',
        onClick: handleSubmit(formSubmitHandler),
        disabled: eventForm.isPending
      }}
      hasBorder
    >
      <styled.Container data-testid="EventForm-test">
        <styled.Item>
          <Controller
            name="title"
            control={control}
            defaultValue={currentEvent?.title ? currentEvent?.title : ''}
            render={({field: {onChange, value}}) => (
              <Input
                value={value}
                onChange={onChange}
                label={t('eventForm.titleLabel')}
                placeholder={t('eventForm.titlePlaceholder') || ''}
                errorMessage={t('eventForm.errorMessage')}
                isError={!!errors.title}
              />
            )}
            rules={{required: true}}
          />
        </styled.Item>
        <styled.Div>
          <styled.DateInput>
            <styled.Item>
              <DatePicker
                selected={startDate}
                onChange={handleStartDate}
                customInput={<Input label={t('eventForm.startDateTimeLabel')} />}
                selectsStart
                showTimeSelect
                timeInputLabel="Start Time"
                startDate={startDate}
                dateFormat={DATE_TIME_FORMAT}
                endDate={endDate}
              />
            </styled.Item>
          </styled.DateInput>
          <styled.DateInput className={cn(errors.end && 'error')}>
            <styled.Item>
              <DatePicker
                selected={endDate}
                onChange={handleEndDate}
                customInput={
                  <Input
                    label={t('eventForm.endDateTimeLabel')}
                    isError={!!errors.end}
                    errorMessage={errors.end?.message}
                  />
                }
                selectsEnd
                showTimeSelect
                timeInputLabel="End Time"
                startDate={startDate}
                dateFormat={DATE_TIME_FORMAT}
                endDate={endDate}
                minDate={startDate}
              />
            </styled.Item>
          </styled.DateInput>
        </styled.Div>
        <styled.Div>
          <styled.Item>
            <Controller
              name="hosted_by"
              control={control}
              defaultValue={currentEvent?.hosted_by ? currentEvent?.hosted_by : ''}
              render={({field: {onChange, value}}) => (
                <Input
                  value={value}
                  onChange={onChange}
                  label={t('eventForm.hostLabel')}
                  placeholder={t('eventForm.hostPlaceholder') || ''}
                  isError={!!errors.hosted_by}
                  errorMessage={t('eventForm.errorMessage')}
                />
              )}
              rules={{required: true}}
            />
          </styled.Item>
          <styled.Item>
            <Controller
              name="web_link"
              control={control}
              defaultValue={currentEvent?.web_link}
              render={({field: {onChange, value}}) => (
                <Input
                  value={value ?? undefined}
                  onChange={onChange}
                  label={t('eventForm.linkLabel')}
                  placeholder={t('eventForm.linkPlaceholder') || ''}
                />
              )}
            />
          </styled.Item>
        </styled.Div>
        <styled.Item>
          <Controller
            name="description"
            control={control}
            defaultValue={currentEvent?.description ? currentEvent?.description : ''}
            render={({field: {onChange, value}}) => (
              <TextArea
                value={value}
                onChange={onChange}
                name={t('eventForm.descriptionLabel')}
                placeholder={t('eventForm.descriptionPlaceholder') || ''}
                isResizable
                isError={!!errors.description}
                errorMessage={t('eventForm.errorMessage') || ''}
              />
            )}
            rules={{required: true}}
          />
        </styled.Item>
        <styled.FileUploaderItem>
          <styled.TileImageUpload>
            {(image || currentEvent?.image) && (
              <styled.ImagePreview
                src={(image && URL.createObjectURL(image)) || eventForm.imageSrc || undefined}
              />
            )}
            <styled.CustomFileUploader
              label={image ? t('fileUploader.changeLabel') : t('fileUploader.uploadLabel')}
              dragActiveLabel={t('fileUploader.dragActiveLabel')}
              fileType="image"
              onFilesUpload={handleImage}
              buttonClassName="upload-button"
            />
          </styled.TileImageUpload>
        </styled.FileUploaderItem>
      </styled.Container>
    </Dialog>
  );
};

export default observer(EventForm);

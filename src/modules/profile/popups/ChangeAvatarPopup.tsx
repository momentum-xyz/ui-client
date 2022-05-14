import React, {useCallback, useEffect, useState} from 'react';
import Cropper from 'react-easy-crop';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {getCroppedImg} from 'core/utils/canvas.utils';
import {ToastContent} from 'ui-kit';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {ReactComponent as Loader} from '../../../images/tail-sping.svg';
import {useCreateUserAvatar} from '../hooks/useUserAvatar';

type props = {
  onSave: () => void;
  onClose: () => void;
};

export const ChangeAvatarPopup = ({onSave, onClose}: props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const createUserAvatar = useCreateUserAvatar();

  useEffect(() => {
    if (croppedImage) {
      croppedImage.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('avatar', blob, 'avatar.png');

          createUserAvatar(formData)
            .then(() => {
              toast.info(
                <ToastContent
                  headerIconName="alert"
                  title={t('titles.alert')}
                  text={t('messages.avatarSuccess')}
                  isCloseButton
                />
              );
              setIsSaving(false);
              if (onSave) onSave();
            })
            .catch(() => {
              toast.error(
                <ToastContent
                  isDanger
                  headerIconName="alert"
                  title={t('titles.alert')}
                  text={t('messages.avatarFailure')}
                  isCloseButton
                />
              );
              setIsSaving(false);
            });
        }
      });
    }
  }, [croppedImage]);

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);

      // apply rotation if needed
      // const orientation = await getOrientation(file)
      // const rotation = ORIENTATION_TO_ANGLE[orientation]
      // if (rotation) {
      //   imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      // }

      // @ts-ignore
      setImageSrc(imageDataUrl);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const submit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    showCroppedImage();
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <Popup className="w-48 md:w-64 transition-height">
      <PopupTitle onClose={onClose}>Change your avatar</PopupTitle>
      <div className="flex gap-2">
        <div className="">
          <p className="mb-2">Choose an avatar that will be shown when your camera is off.</p>
          <form onSubmit={submit} autoComplete="off">
            <label className="inline-flex items-center bg-gradient-blue-green-20 text-prime-blue-100 border border-gradient-blue-green-100 border-solid px-1.5 h-3 text-xs font-medium mb-2">
              <input type="file" onChange={onFileChange} accept="image/*" className="hidden" />
              <span className="">Select image file</span>
            </label>

            <div className="w-full h-15 bg-black-100 relative flex items-center justify-center">
              {imageSrc ? (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  minZoom={0.5}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  objectFit="horizontal-cover"
                />
              ) : (
                <p>Select an image file first</p>
              )}
            </div>

            {/*{croppedImage && <img src={croppedImage} className="w-5 h-5" /> }*/}

            <div className="flex gap-1 mt-2">
              <Button type="primary" submit>
                Change avatar {isSaving && <Loader className="ml-2 w-2 h-4" />}
              </Button>
              <Button type="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Popup>
  );
};

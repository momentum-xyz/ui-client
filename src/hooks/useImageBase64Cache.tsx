/*
    Deze hook cached images in memory als base64 data url.
    Dit kun je gebruiken voor image components die verplaatsen van locatie op het scherm.
    Of voor icons die vaak dynamisch ingeladen worden.
    Dit voorkomt flickering wanneer het react image component het plaatje opnieuw moet ophalen.
*/

import {useEffect, useState} from 'react';

// @ts-ignore: refactoring
// eslint-disable-next-line @typescript-eslint/typedef
function toDataURL(url: string, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

const images: {[key: string]: string} = {};

export const useImageBase64Cache = (url: string) => {
  const forceUpdate: () => void = useState()[1].bind(null, undefined);

  useEffect(() => {
    if (!images[url]) {
      toDataURL(url, function (dataUrl: string) {
        images[url] = dataUrl;
        forceUpdate();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (images[url]) {
    return images[url];
  }

  return url;
};

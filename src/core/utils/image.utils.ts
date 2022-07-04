import {useEffect, useState} from 'react';

// @ts-ignore
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

export const ImageBase64Cache = (url: string) => {
  const forceUpdate: () => void = useState()[1].bind(null, undefined);

  useEffect(() => {
    if (!images[url]) {
      toDataURL(url, function (dataUrl: string) {
        images[url] = dataUrl;
        forceUpdate();
      });
    }
  }, [url]);

  if (images[url]) {
    return images[url];
  }

  return url;
};

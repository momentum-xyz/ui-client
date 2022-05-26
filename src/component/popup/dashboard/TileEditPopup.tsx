import React, {useState} from 'react';

import {Dashboard, Tile} from '../../../hooks/api/useDashboardService';
import Button from '../../atoms/Button';
import Input, {TextArea} from '../../atoms/input/Input';
import Popup, {PopupTitle} from '../../atoms/Popup';

type props = {
  onSave: (tile: Tile, file: File | null) => void;
  onClose: () => void;
  tile: Tile;
  // eslint-disable-next-line react/no-unused-prop-types
  dashboard?: Dashboard;
};

export const TileEditPopup = ({onSave, onClose, tile}: props) => {
  const [file, setFile] = useState<File | null>(null);
  const [internalTile, setTile] = useState<Tile>(tile);

  // @ts-ignore: refactoring
  const handleTitle = (event) => {
    event.persist();
    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        title: event.target.value
      }
    }));
  };

  // @ts-ignore: refactoring
  const handleURL = (event) => {
    event.persist();
    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        url: event.target.value
      }
    }));
  };

  // @ts-ignore: refactoring
  const handleText = (event) => {
    event.persist();
    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        text: event.target.value
      }
    }));
  };

  // @ts-ignore: refactoring
  const handleFile = async (event) => {
    const file: File = event.target.files[0];
    setFile(file);
    // if (!file) return;
    // console.info('fileSize is', file.size);
    // if (file.size > 1024 * 1000) {
    //   alert('uploaded image cannot be larger than 1MB');
    //   event.target.value = null;
    // }
    //
    // const url = `${window._env_.BACKEND_ENDPOINT_URL}/upload`;
    //
    // const formData = new FormData();
    // formData.append('file', file);
    //
    // const response = await axios.post(url, formData, requestHeaders);
    //
    // var reader = new FileReader();
    // reader.onloadend = function (e) {
    //   setTile((tile) => ({
    //     ...tile,
    //     content: {
    //       ...tile.content,
    //       url: response.data,
    //       file: file,
    //     },
    //   }));
    // };
    // reader.readAsDataURL(file);
  };

  // @ts-ignore: refactoring
  const submit = (e) => {
    e.preventDefault();
    onSave(
      {
        ...internalTile,
        updated_at: new Date().toISOString()
      },
      file
    );
  };

  return (
    <Popup className="w-48">
      <PopupTitle onClose={onClose}>Edit tile</PopupTitle>
      <form onSubmit={submit}>
        {internalTile.type === 'TILE_TYPE_MEDIA' && (
          <>
            <div className="flex gap-1 mb-1">Type: {internalTile.permanentType}</div>
            <div className="mb-2">
              <Input
                label="image"
                type="file"
                data-max-size="246k"
                accept="image/*"
                onChange={handleFile}
                required
              />
            </div>
          </>
        )}
        {internalTile.type === 'TILE_TYPE_TEXT' && [
          internalTile.permanentType === null ? (
            <Input
              key="title"
              type="text"
              label="Title"
              name="title"
              value={internalTile.content?.title || ''}
              placeholder="I am a tile!"
              onChange={handleTitle}
              required
            />
          ) : null,
          // eslint-disable-next-line react/jsx-key
          <TextArea
            name="message"
            label="Message"
            value={internalTile.content?.text || ''}
            placeholder="This is my body"
            onChange={handleText}
            required
          />
        ]}
        {internalTile.type === 'TILE_TYPE_VIDEO' && [
          // eslint-disable-next-line react/jsx-key
          <Input
            type="text"
            label="Youtube video url"
            name="url"
            value={internalTile.content?.url || ''}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onChange={handleURL}
            required
          />
        ]}
        <div className="flex gap-1 mt-2">
          <Button type="primary" submit>
            save
          </Button>
          <Button type="ghost" onClick={onClose}>
            cancel
          </Button>
        </div>
      </form>
    </Popup>
  );
};

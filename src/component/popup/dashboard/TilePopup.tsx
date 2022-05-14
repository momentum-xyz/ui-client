import React, {useState} from 'react';

import {Dashboard, Tile, TileType} from '../../../hooks/api/useDashboardService';
import Button from '../../atoms/Button';
import Input, {TextArea} from '../../atoms/input/Input';
import Select, {Option} from '../../atoms/input/Select';
import Popup, {PopupTitle} from '../../atoms/Popup';
import {SpaceType} from '../../../context/type/Space';

const tileTypes = {
  TILE_TYPE_TEXT: 'Text',
  TILE_TYPE_MEDIA: 'Image',
  TILE_TYPE_VIDEO: 'Video'
};

type props = {
  onSave: (tile: Tile, file: File | null) => void;
  onClose: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  dashboard?: Dashboard;
  // eslint-disable-next-line react/no-unused-prop-types
  spaceType: SpaceType | undefined;
};

const defaultTiles: {[key: string]: Tile} = {
  TILE_TYPE_TEXT: {
    id: 'temp',
    type: TileType.TILE_TYPE_TEXT,
    content: {
      type: 'normal'
    },
    permanentType: null,
    column: 0,
    row: 0,
    render: 0,
    internal: true
  },
  TILE_TYPE_MEDIA: {
    id: 'temp',
    type: TileType.TILE_TYPE_MEDIA,
    content: {
      type: 'normal'
    },
    permanentType: null,
    column: 0,
    row: 0,
    render: 1,
    internal: true
  },
  TILE_TYPE_VIDEO: {
    id: 'temp',
    type: TileType.TILE_TYPE_VIDEO,
    content: {},
    permanentType: null,
    column: 0,
    row: 0,
    render: 1,
    internal: true
  }
};

export const TilePopup = ({onSave, onClose}: props) => {
  const [tile, setTile] = useState<Tile>(defaultTiles[TileType.TILE_TYPE_TEXT]);
  const [file, setFile] = useState<File | null>(null);

  const handleTitle = (event) => {
    event.persist();
    event.target.setCustomValidity(
      event.target.value.trim().length === 0 ? 'Only whitespaces not allowed' : ''
    );

    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        title: event.target.value
      }
    }));
  };

  const handleText = (event) => {
    event.persist();
    event.target.setCustomValidity(
      event.target.value.trim().length === 0 ? 'Only whitespaces not allowed' : ''
    );
    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        text: event.target.value
      }
    }));
  };

  const handleURL = (event) => {
    event.persist();
    event.target.setCustomValidity(
      event.target.value.trim().length === 0 ? 'URL cannot be empty' : ''
    );
    setTile((tile) => ({
      ...tile,
      content: {
        ...tile.content,
        url: event.target.value
      }
    }));
  };

  const handleFile = (event) => {
    const file: File = event.target.files[0];
    setFile(file);
  };

  const submit = (e) => {
    e.preventDefault();

    onSave(
      {
        ...tile,
        updated_at: new Date().toISOString()
      },
      file
    );
  };

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>Create a new tile</PopupTitle>
      <form onSubmit={submit} autoComplete="off">
        <Select value={tile.type} onChange={(e) => setTile(defaultTiles[e.target.value])}>
          {Object.keys(tileTypes).map((type, i) => (
            <Option value={type} key={i}>
              {tileTypes[type]}
            </Option>
          ))}
        </Select>
        {tile.type === TileType.TILE_TYPE_MEDIA && (
          <>
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
        {tile.type === TileType.TILE_TYPE_TEXT && [
          tile.permanentType === null ? (
            <Input
              type="text"
              label="Title"
              name="title"
              value={tile.content?.title || ''}
              placeholder="I am a tile!"
              onChange={handleTitle}
              required
            />
          ) : null,
          // eslint-disable-next-line react/jsx-key
          <TextArea
            name="message"
            label="Message"
            value={tile.content?.text || ''}
            placeholder="This is my body"
            onChange={handleText}
            required
          />
        ]}
        {tile.type === TileType.TILE_TYPE_VIDEO && [
          // eslint-disable-next-line react/jsx-key
          <Input
            type="text"
            label="Youtube video url"
            name="url"
            value={tile.content?.url || ''}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onChange={handleURL}
            required
          />
        ]}
        <div className="flex gap-1 mt-2">
          <Button type="primary" submit>
            Create Tile
          </Button>
          <Button type="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </form>
    </Popup>
  );
};

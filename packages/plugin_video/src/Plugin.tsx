import {
  UnityAutoTakeKeyboardControl,
  UsePluginHookType,
  useSharedObjectState
} from '@momentum-xyz/sdk';
import {Button, Input, Text} from '@momentum-xyz/ui-kit';
import '@momentum-xyz/ui-kit/dist/themes/themes';
import {useState} from 'react';

// Use react-twitch-embed if more functionality is needed for twitch

interface PluginStateInterface {
  video_url?: string;
  youtube_url?: string; // for backward compatibility
}

const stateToQuery = (state: PluginStateInterface): string | null => {
  const {video_url, youtube_url} = state;
  const url = video_url || youtube_url;
  // parse shared url and create embed url for youtube, twitch, vimeo
  if (url) {
    if (url.includes('youtube.com')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('/')[3];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('twitch.tv')) {
      const videoId = url.split('/')[3];
      if (/^\d+$/.test(videoId)) {
        return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
      } else {
        return `https://player.twitch.tv/?channel=${videoId}&parent=${window.location.hostname}`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('/')[3];
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }

  return null;
};

const usePlugin: UsePluginHookType = (props) => {
  const {isAdmin} = props;
  console.log('PLUGIN VIDEO', props);

  const [editMode, setEditMode] = useState(false);
  const [modifiedState, setModifiedState] = useState<PluginStateInterface | null>(null);
  const [error, setError] = useState<string>();

  const [sharedState, setSharedState] = useSharedObjectState<PluginStateInterface>();

  const handleConfigSave = async () => {
    try {
      if (modifiedState) {
        await setSharedState(modifiedState);
        setModifiedState(null);
      }
      setEditMode(false);
    } catch (e: any) {
      console.error(e);
      setError(`Unable to save. ${e.message}`);
    }
  };
  const handleCancel = () => {
    setModifiedState(null);
    setEditMode(false);
  };

  const embedUrl = sharedState ? stateToQuery(sharedState) : null;

  const actions = !isAdmin ? (
    <span />
  ) : editMode ? (
    <>
      <Button onClick={handleConfigSave} label="Save" />
      &nbsp;
      <Button onClick={handleCancel} label="Cancel" />
    </>
  ) : (
    <Button onClick={() => setEditMode(true)} label="Change" />
  );

  const content = editMode ? (
    <div style={{padding: '1em'}}>
      <UnityAutoTakeKeyboardControl />
      <Input
        type="text"
        label="Video URL"
        placeholder="Paste a YouTube, Twitch, or Vimeo Share URL here."
        autoFocus
        value={modifiedState?.video_url || sharedState?.video_url || sharedState?.youtube_url || ''}
        onChange={(value) => setModifiedState({video_url: value})}
        isError={!!error}
        errorMessage={error}
      />
    </div>
  ) : embedUrl ? (
    <iframe title="Video" src={embedUrl} height="100%" width="100%" allowFullScreen></iframe>
  ) : (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text text="Video not yet set" size="m" />
    </div>
  );

  return {
    objectView: {
      title: 'Video',
      actions,
      content
    }
  };
};

const Plugin = {
  usePlugin
};

export default Plugin;

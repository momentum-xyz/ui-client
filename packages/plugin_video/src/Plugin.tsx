import {useState} from 'react';
import {
  UnityAutoTakeKeyboardControl,
  UsePluginHookType,
  useSharedObjectState
} from '@momentum-xyz/sdk';
import {Button, Input, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import '@momentum-xyz/ui-kit/dist/themes/themes';

// Use react-twitch-embed if more functionality is needed for twitch

// TODO remove the need of this extend
interface PluginStateInterface extends Record<string, unknown> {
  video_url?: string;
  youtube_url?: string; // for backward compatibility
  state?: {
    // for backward compatibility
    video_url: string;
  };
}

const stateToQuery = (state: PluginStateInterface): string | null => {
  const {video_url, youtube_url, state: nestedState} = state;
  const url = video_url || youtube_url || nestedState?.video_url;

  // parse shared url and create embed url for youtube, twitch, vimeo
  if (url) {
    try {
      const [urlBase, paramsString] = url.split('?');
      const searchParams = new URLSearchParams(paramsString);

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtube.com') ? searchParams.get('v') : urlBase.split('/')[3];
        assert(videoId);

        searchParams.delete('v');

        if (searchParams.has('t')) {
          searchParams.set('start', String(parseInt(searchParams.get('t') || '')));
          searchParams.delete('t');
        }

        return `https://www.youtube.com/embed/${videoId}?${searchParams.toString()}`;
      } else if (url.includes('twitch.tv')) {
        const videoId = url.split('/')[3];
        assert(videoId);
        searchParams.set('parent', window.location.hostname);
        if (/^\d+$/.test(videoId)) {
          searchParams.set('video', videoId);
          return `https://player.twitch.tv/?${searchParams.toString()}`;
        } else {
          searchParams.set('channel', videoId);
          return `https://player.twitch.tv/?${searchParams.toString()}`;
        }
      } else if (url.includes('vimeo.com')) {
        const videoId = url.split('/')[3];
        assert(videoId);
        return `https://player.vimeo.com/video/${videoId}?${searchParams.toString()}`;
      }
    } catch (e) {
      console.log('Error parsing url:', e);
      return null;
    }
  }

  return null;
};

const assert = (value: string | null) => {
  if (!value) {
    throw new Error('Missing required field');
  }
};

const usePlugin: UsePluginHookType = (props) => {
  const {isAdmin} = props;
  console.log('PLUGIN VIDEO', props);

  const [editMode, setEditMode] = useState(false);
  const [modifiedState, setModifiedState] = useState<PluginStateInterface | null>(null);
  const [error, setError] = useState<string>();
  const isModifiedStateError = modifiedState?.video_url ? !stateToQuery(modifiedState) : false;

  const [sharedState, setSharedState] = useSharedObjectState<PluginStateInterface>();
  console.log('sharedState', sharedState);

  const {t} = useI18n();

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
  console.log('embedUrl', embedUrl);

  const actions = !isAdmin ? (
    <span />
  ) : editMode ? (
    <>
      <Button
        onClick={handleConfigSave}
        label={t('plugin_video.actions.save')}
        disabled={isModifiedStateError}
      />
      &nbsp;
      <Button onClick={handleCancel} label={t('plugin_video.actions.cancel')} />
    </>
  ) : (
    <Button onClick={() => setEditMode(true)} label={t('plugin_video.actions.change')} />
  );

  const content = editMode ? (
    <div style={{padding: '1em'}}>
      <UnityAutoTakeKeyboardControl />
      <Input
        type="text"
        label={t('plugin_video.labels.videoUrl')}
        placeholder={t('plugin_video.messages.pasteUrl')}
        autoFocus
        value={
          modifiedState?.video_url ??
          (sharedState?.video_url ||
            sharedState?.youtube_url ||
            sharedState?.state?.video_url ||
            '')
        }
        onChange={(value) => setModifiedState({video_url: value})}
        isError={!!error || isModifiedStateError}
        errorMessage={error || t('plugin_video.messages.invalidUrl') || ''}
      />
    </div>
  ) : embedUrl ? (
    <iframe
      key={embedUrl}
      title={t('plugin_video.labels.video') || ''}
      src={embedUrl}
      height="100%"
      width="100%"
      allowFullScreen
    ></iframe>
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
      <Text text={t('plugin_video.messages.noUrl')} size="m" />
    </div>
  );

  return {
    objectView: {
      title: t('plugin_video.labels.video') || '',
      actions,
      content
    }
  };
};

const Plugin = {
  usePlugin
};

export default Plugin;

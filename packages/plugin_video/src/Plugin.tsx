import {useState} from 'react';
import {UsePluginHookType, useSharedObjectState} from '@momentum-xyz/sdk';
import {Input, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import '@momentum-xyz/ui-kit/dist/themes/themes';

// Use react-twitch-embed if more functionality is needed for twitch

// TODO remove the need of this extend
interface PluginStateInterface extends Record<string, unknown> {
  video_url?: string;
  youtube_url?: string; // for backward compatibility
  title?: string;
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

  const [modifiedState, setModifiedState] = useState<PluginStateInterface | null>(null);
  const [error, setError] = useState<string>();
  const isModifiedStateError = modifiedState?.video_url ? !stateToQuery(modifiedState) : false;

  const [sharedState, setSharedState] = useSharedObjectState<PluginStateInterface>();
  console.log('sharedState', sharedState);

  const {t} = useI18n();

  const saveChanges = async () => {
    try {
      if (modifiedState) {
        await setSharedState(modifiedState);
        setModifiedState(null);
      }
    } catch (e: any) {
      console.error(e);
      setError(`Unable to save. ${e.message}`);
    }
  };

  const state = modifiedState ?? sharedState;

  const embedUrl = state ? stateToQuery(state) : null;
  console.log('embedUrl', embedUrl);

  const content = embedUrl ? (
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

  const editModeContent = !isAdmin ? (
    <span />
  ) : (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <Text text={t('plugin_video.labels.embed')} size="l" align="left" transform="uppercase" />
      <Text
        text="By embedding a video to this object; users will also be able to see this video played when they select the object; regardless of its asset type."
        size="m"
        align="left"
      />
      <Text
        text="To embed a video; add the url to the video in the input field below."
        size="m"
        align="left"
      />
      <hr />
      <Input
        type="text"
        // label={t('plugin_video.labels.videoUrl')}
        placeholder={t('plugin_video.messages.pasteUrl')}
        autoFocus
        value={
          modifiedState?.video_url ??
          (sharedState?.video_url ||
            sharedState?.youtube_url ||
            sharedState?.state?.video_url ||
            '')
        }
        onChange={(value) =>
          setModifiedState({
            ...(modifiedState || sharedState),
            video_url: value
          })
        }
        isError={!!error || isModifiedStateError}
        errorMessage={error || t('plugin_video.messages.invalidUrl') || ''}
      />
      <br />
      <Text
        text={t('plugin_video.labels.videoPreview')}
        size="m"
        align="left"
        transform="uppercase"
      />
      {content}
      <hr />
      <Input
        type="text"
        // label={t('plugin_video.labels.title')}
        placeholder={t('plugin_video.messages.name')}
        value={modifiedState?.title ?? sharedState?.title ?? ''}
        onChange={(value) =>
          setModifiedState({
            ...(modifiedState || sharedState),
            title: value
          })
        }
      />
    </div>
  );

  return {
    objectView: {
      title: sharedState?.title || '',
      content,
      editModeContent,
      saveChanges
    }
  };
};

const Plugin = {
  usePlugin
};

export default Plugin;

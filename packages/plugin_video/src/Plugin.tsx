import {useState} from 'react';
import {UsePluginHookType, useSharedObjectState} from '@momentum-xyz/sdk';
import {Input} from '@momentum-xyz/ui-kit';
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
  const {isAdmin, theme} = props;
  console.log('PLUGIN VIDEO', props, theme);

  const [modifiedState, setModifiedState] = useState<PluginStateInterface | null>(null);
  const [error, setError] = useState<string>();
  const isModifiedStateError = modifiedState?.video_url ? !stateToQuery(modifiedState) : false;

  const [sharedState, setSharedState] = useSharedObjectState<PluginStateInterface>();
  console.log('sharedState', sharedState);

  const isLoading = sharedState === undefined;

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
  ) : isLoading ? (
    <span />
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
      {t('plugin_video.messages.noUrl')}
    </div>
  );

  const isError = !!error || isModifiedStateError;

  const editModeContent = !isAdmin ? (
    <span />
  ) : (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: 'var(--font-size-l)',
          fontWeight: 600,
          letterSpacing: '0.2em'
        }}
      >
        {t('plugin_video.labels.embed')}
      </div>
      <p>
        By embedding a video to this object; users will also be able to see this video played when
        they select the object; regardless of its asset type.
      </p>
      <p>To embed a video; add the url to the video in the input field below.</p>
      <div style={{backgroundColor: theme.accentText, height: 1}} />
      <Input
        wide
        // type="text"
        // label={t('plugin_video.labels.videoUrl')}
        placeholder={t('plugin_video.messages.pasteUrl')}
        // autoFocus
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
        danger={isError}
        // errorMessage={error || t('plugin_video.messages.invalidUrl') || ''}
      />
      <div>{isError && (error || t('plugin_video.messages.invalidUrl') || '')}</div>
      {!!embedUrl && (
        <>
          <br />
          <h3 style={{textTransform: 'uppercase'}}>{t('plugin_video.labels.videoPreview')}</h3>
          {content}
        </>
      )}
      <div style={{backgroundColor: theme.accentText, height: 1}} />
      <Input
        wide
        // type="text"
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

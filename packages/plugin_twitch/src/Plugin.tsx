import {
  UnityAutoTakeKeyboardControl,
  UsePluginHookType,
  useSharedObjectState
} from '@momentum-xyz/sdk';
import {Button, Input, Text} from '@momentum-xyz/ui-kit';
import '@momentum-xyz/ui-kit/dist/themes/themes';
import {useState} from 'react';

// Use react-twitch-embed if more functionality is needed

interface PluginStateInterface {
  channel?: string;
  video?: string;
  collection?: string;
}

const stateToQuery = (state: PluginStateInterface): string | null => {
  const {channel, video, collection} = state;
  if (channel) {
    return `channel=${channel}`;
  } else if (video) {
    return `video=${video}`;
  } else if (collection) {
    return `collection=${collection}`;
  }
  return null;
};

const usePlugin: UsePluginHookType = (props) => {
  const {isAdmin} = props;
  console.log('PLUGIN TWITCH', props);

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

  const contentUriParam = sharedState ? stateToQuery(sharedState) : null;

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
        label="Channel"
        autoFocus
        value={modifiedState?.channel || sharedState?.channel || ''}
        onChange={(value) => setModifiedState({channel: value})}
        isError={!!error}
        errorMessage={error}
      />
    </div>
  ) : contentUriParam ? (
    <iframe
      title="Twitch"
      // src={`https://player.twitch.tv/?channel=yejuniverse&parent=${window.location.hostname}`}
      src={`https://player.twitch.tv/?${contentUriParam}&parent=${window.location.hostname}`}
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
      <Text text="Channel not yet set" size="m" />
    </div>
  );

  return {
    objectView: {
      title: 'Twitch',
      actions,
      content
    }
  };
};

const Plugin = {
  usePlugin
};

export default Plugin;

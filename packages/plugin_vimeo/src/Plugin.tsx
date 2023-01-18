import {
  UnityAutoTakeKeyboardControl,
  UsePluginHookType,
  useSharedObjectState
} from '@momentum-xyz/sdk';
import {Button, Input, Text} from '@momentum-xyz/ui-kit';
import '@momentum-xyz/ui-kit/dist/themes/themes';
import {useState} from 'react';

interface PluginStateInterface {
  video?: string;
}

const usePlugin: UsePluginHookType = (props) => {
  const {isAdmin} = props;
  console.log('PLUGIN VIMEO', props);

  const [editMode, setEditMode] = useState(false);
  const [modifiedState, setModifiedState] = useState<PluginStateInterface | null>(null);
  const [error, setError] = useState<string>();

  const [sharedState, setSharedState] = useSharedObjectState<PluginStateInterface>();

  const handleConfigSave = async () => {
    try {
      if (modifiedState) {
        setError(undefined);
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

  const contentUriParam = sharedState?.video || null;

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
        value={modifiedState?.video || sharedState?.video || ''}
        onChange={(value) => setModifiedState({video: value})}
        isError={!!error}
        errorMessage={error}
      />
    </div>
  ) : contentUriParam ? (
    <iframe
      title="Vimeo"
      src={`https://player.vimeo.com/video/${contentUriParam}?title=0&byline=0&portrait=0`}
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
      <Text text="Video not yet set" size="m" />
    </div>
  );

  return {
    objectView: {
      title: 'Vimeo',
      actions,
      content
    }
  };
};

const Plugin = {
  usePlugin
};

export default Plugin;

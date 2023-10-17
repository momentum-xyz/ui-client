import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Heading, Separator} from '@momentum-xyz/ui-kit';

// import blockadelabs from 'static/images/blockadelabs.svg';
import blockadelabs from 'static/images/blockadelabs.png';
import leonardo from 'static/images/leonardo.jpeg';
import openai from 'static/images/openai.png';
// import agora from 'static/images/agora.png';
import {useStore} from 'shared/hooks';

import * as styled from './ApiKeys.styled';
import {KeyItemTile, KeyItemTileValueInterface} from './components';

const ApiKeys: FC = () => {
  const {fetchApiKeys, attrBlockadelabs, attrLeonardo, attrOpenai} = useStore().adminStore;
  console.log('attrBlockadelabs', attrBlockadelabs.value);
  console.log('attrLeonardo', attrLeonardo.value);
  console.log('attrOpenai', attrOpenai.value);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const [modifiedValues, setModifiedValues] =
    useState<Partial<Record<'bl' | 'leo' | 'openai', KeyItemTileValueInterface>>>();

  const handleSave = async () => {
    if (modifiedValues?.bl) {
      await attrBlockadelabs.set(modifiedValues.bl);
    }
    if (modifiedValues?.leo) {
      await attrLeonardo.set(modifiedValues.leo);
    }
    if (modifiedValues?.openai) {
      await attrOpenai.set(modifiedValues.openai);
    }
    await fetchApiKeys();
    setModifiedValues(undefined);
  };

  return (
    <styled.Container>
      <Heading variant="h2">Manage API Keys</Heading>
      <Separator />

      <KeyItemTile
        value={modifiedValues?.bl || (attrBlockadelabs.value as KeyItemTileValueInterface)}
        defaultValue={{
          api_key: '',
          secret: ''
        }}
        onChange={(val) => setModifiedValues({...modifiedValues, bl: val})}
        icon={blockadelabs}
        title="BlockadeLabs"
        description="AI-powered generating of skybox from text prompts"
      />

      <KeyItemTile
        value={modifiedValues?.openai || (attrOpenai.value as KeyItemTileValueInterface)}
        defaultValue={{
          api_key: '',
          max_tokens: 50,
          temperature: 0.7
        }}
        onChange={(val) => setModifiedValues({...modifiedValues, openai: val})}
        icon={openai}
        title="OpenAI"
        description="Generative AI for text, image, and more"
      />

      <KeyItemTile
        value={modifiedValues?.leo || (attrLeonardo.value as KeyItemTileValueInterface)}
        defaultValue={{
          api_key: ''
        }}
        onChange={(val) => setModifiedValues({...modifiedValues, leo: val})}
        icon={leonardo}
        title="Leonardo"
        description="Generative AI platform for creating artwork"
      />

      {/* <KeyItemTile
        value={}
        onChange={() => {}}
        icon={agora}
        title="Agora"
        description="Voice and video APIs for developers"
      /> */}

      <Separator />

      <div>
        <Button icon="save" onClick={handleSave} label="Save" />
      </div>
    </styled.Container>
  );
};

export default observer(ApiKeys);

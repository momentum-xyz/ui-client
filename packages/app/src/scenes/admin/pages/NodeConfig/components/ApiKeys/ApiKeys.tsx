import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Heading, Separator} from '@momentum-xyz/ui-kit';

// import blockadelabs from 'static/images/blockadelabs.svg';
import leonardo from 'static/images/leonardo.jpeg';
import openai from 'static/images/openai.png';
import agora from 'static/images/agora.png';

import * as styled from './ApiKeys.styled';
import {KeyItemTile} from './components';

const PLACEHOLDER = 'Your API key';

const ApiKeys: FC = () => {
  return (
    <styled.Container>
      <Heading variant="h2">Manage API Keys</Heading>
      <Separator />

      {/* <KeyItemTile
        value=""
        placeholder={PLACEHOLDER}
        onChange={() => {}}
        icon={blockadelabs}
        title="BlockadeLabs"
      /> */}

      <KeyItemTile
        value=""
        placeholder={PLACEHOLDER}
        onChange={() => {}}
        icon={openai}
        title="OpenAI"
        description="Generative AI for text, image, and more"
      />

      <KeyItemTile
        value=""
        placeholder={PLACEHOLDER}
        onChange={() => {}}
        icon={leonardo}
        title="Leonardo"
        description="Generative AI platform for creating artwork"
      />

      <KeyItemTile
        value=""
        placeholder={PLACEHOLDER}
        onChange={() => {}}
        icon={agora}
        title="Agora"
        description="Voice and video APIs for developers"
      />

      <Separator />

      <div>
        <Button icon="save" onClick={() => {}} label="Save" />
      </div>
    </styled.Container>
  );
};

export default observer(ApiKeys);

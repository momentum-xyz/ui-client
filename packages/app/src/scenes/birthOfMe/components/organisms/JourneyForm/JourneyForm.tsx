import React, {FC} from 'react';
import {Button, FileUploader, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'scenes/birthOfMe/components';

import * as styled from './JourneyForm.styled';

const JourneyForm: FC = () => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="2. Mint your Odyssey" align="left" />
        <Text size="m" text="Choose an image for your journey" align="left" />
        <styled.AvatarImageUpload>
          <FileUploader
            label="Upload Image"
            dragActiveLabel="Drop the files here..."
            fileType="image"
            onFilesUpload={(file) => console.log(file)}
            maxSize={10 * Math.pow(2, 20)}
            onError={(error) => console.error(error)}
            enableDragAndDrop={false}
          />
        </styled.AvatarImageUpload>

        <Text size="m" text="What should we call you?" align="left" />
        <styled.ImageContainer>
          <IconSvg name="profile" size="large" />
          <InputDark placeholder="Choose your name" />
        </styled.ImageContainer>

        <Text
          size="m"
          text="All set, let’s go! Create an NFT with your personal journey"
          align="left"
        />
        <Button label="Create your journey" icon="planet" />
      </styled.Div>
    </Box>
  );
};

export default JourneyForm;

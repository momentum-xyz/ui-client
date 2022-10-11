import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import {FileUploader} from '@momentum/ui-kit';

export const Container = styled.div`
  padding: 10px;
  margin: 10px;
  width: 567px;
`;

export const TileImageUpload = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: var(--uploader-bg);
  backdrop-filter: blur(10px);
  gap: 10px;
`;

export const CustomFileUploader = styled(FileUploader)`
  .upload-button {
    width: 110px;
    padding: 0;
  }
`;

export const ImagePreview = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 5px;
  object-fit: cover;
`;

export const Item = styled.div`
  flex: 50%;
  padding-top: 20px;
`;

export const FileUploaderItem = styled.div`
  flex: 50%;
  padding-top: 25px;
`;

export const DateInput = styled.div`
  flex: 50%;
  z-index: calc(var(--dialog-z-index) + 2);
`;

export const Div = styled.div`
  display: flex;

  ${Item} ~ ${Item} {
    padding-left: 20px;
  }

  ${DateInput} ~ ${DateInput} {
    padding-left: 20px;
  }
`;

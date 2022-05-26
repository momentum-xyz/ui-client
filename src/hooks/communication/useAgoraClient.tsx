import {useContext} from 'react';

import {AgoraContext} from '../../context/AgoraContext';

export const useAgoraClient = () => {
  const {client} = useContext(AgoraContext);

  return client;
};

export const useStageClient = () => {
  const {stageClient} = useContext(AgoraContext);

  return stageClient;
};

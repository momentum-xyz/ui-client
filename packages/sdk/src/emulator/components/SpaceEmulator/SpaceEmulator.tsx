import {FC, useState} from 'react';
import {Switch, Route, useHistory, useParams, Redirect, generatePath} from 'react-router-dom';

import {ROUTES} from '../../constants';
import {PluginInterface} from '../../../interfaces';
import {SpaceTabEmulator} from '../SpaceTabEmulator';

import * as styled from './SpaceEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
  onClose: () => void;
}

export const SpaceEmulator: FC<PropsInterface> = ({plugin, onClose}) => {
  const {spaceId} = useParams<{spaceId: string}>();
  console.log('RENDER SpaceEmulator', {plugin, spaceId});
  const history = useHistory();

  const [topBar = <span />, setTopBar] = useState<JSX.Element | null>(null);
  const [subtitle, setSubtitle] = useState<string>();

  return (
    <styled.SpaceLayout>
      <styled.SpaceNav>
        <styled.SpaceTab
          onClick={() => {
            history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
            setTopBar(null);
          }}
        >
          Dashboard
        </styled.SpaceTab>
        <styled.SpaceTab
          onClick={() => history.push(generatePath(ROUTES.collaboration.plugin, {spaceId}))}
        >
          Plugin
        </styled.SpaceTab>
      </styled.SpaceNav>
      <styled.SpaceTabContainer>
        <styled.SpaceTopBar>
          <strong>Space / Plugin {subtitle && `/ ${subtitle}`}</strong>
          {topBar}
          <button onClick={() => onClose()}>X</button>
        </styled.SpaceTopBar>
        <styled.SpaceContent>
          <Switch>
            <Route exact path={generatePath(ROUTES.collaboration.dashboard, {spaceId})}>
              <div>Dashboard Content</div>
            </Route>
            <Route exact path={generatePath(ROUTES.collaboration.plugin, {spaceId})}>
              <SpaceTabEmulator
                plugin={plugin}
                setTopBar={setTopBar}
                setSubtitle={setSubtitle}
                spaceId={spaceId}
              />
            </Route>
            <Redirect to={generatePath(ROUTES.collaboration.dashboard, {spaceId})} />
          </Switch>
        </styled.SpaceContent>
      </styled.SpaceTabContainer>
    </styled.SpaceLayout>
  );
};

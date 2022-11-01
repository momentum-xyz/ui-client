import {FC, useState} from 'react';
import {useRouteMatch, Switch, Route, useHistory, useParams, Redirect} from 'react-router-dom';

import {PluginInterface} from '../../../interfaces';
import {SpaceTabEmulator} from '../SpaceTabEmulator';

import * as styled from './SpaceEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
  onClose: () => void;
}

export const SpaceEmulator: FC<PropsInterface> = ({plugin, onClose}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const {path, url} = useRouteMatch();
  const {spaceId} = useParams<{spaceId: string}>();
  const history = useHistory();

  const [topBar = <span />, setTopBar] = useState<JSX.Element | null>(null);

  return (
    <styled.SpaceLayout>
      <styled.SpaceNav>
        <styled.SpaceTab
          onClick={() => {
            history.push(`${url}/dashboard`);
            setTopBar(null);
          }}
        >
          Dashboard
        </styled.SpaceTab>
        <styled.SpaceTab onClick={() => history.push(`${url}/plugin`)}>Plugin</styled.SpaceTab>
      </styled.SpaceNav>
      <styled.SpaceTabContainer>
        <styled.SpaceTopBar>
          <strong>Space / Plugin</strong>
          {topBar}
          <button onClick={() => onClose()}>X</button>
        </styled.SpaceTopBar>
        <styled.SpaceContent>
          <Switch>
            <Route path={`${path}/dashboard`}>
              <div>Dashboard Content</div>
            </Route>
            <Route path={`${path}/plugin`}>
              <SpaceTabEmulator plugin={plugin} setTopBar={setTopBar} spaceId={spaceId} />
            </Route>
            <Redirect to={`${path}/dashboard`} />
          </Switch>
        </styled.SpaceContent>
      </styled.SpaceTabContainer>
    </styled.SpaceLayout>
  );
};

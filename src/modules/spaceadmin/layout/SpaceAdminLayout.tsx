import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {MetaPanelView} from '../views/MetaPanelView';
import Page from '../../../component/molucules/Page';
import {UsersPanelView} from '../views/UsersPanelView';
import {SpacesPanelView} from '../views/SpacesPanelView';
import {useGetSpace} from '../../../hooks/api/useSpaceService';
import Panel from '../../../component/atoms/Panel';
import {useSpaceType} from '../../../hooks/api/useSpaceType';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import TokenManagementView from '../views/TokenManagementView';
import WhitelistRequestsPanel from '../views/WhitelistRequestsPanel';
import TokenRulesPanelView from '../views/TokenRulesPanelView';
import {useGetTokenRules, useGetTokens, useGetWhitelistRequests} from '../hooks/useTokenSpace';

export interface SpaceAdminLayoutProps {
  currentWorld: any;
}

interface ParamTypes {
  id: string;
}
const SpaceAdminLayout: React.FC<SpaceAdminLayoutProps> = ({currentWorld}) => {
  const {id} = useParams<ParamTypes>();
  const spaceId = id;
  const [tokenRulesList, , , refetchTokenRules] = useGetTokenRules(spaceId);
  const [whitelistItems, , , refetchWhitelist] = useGetWhitelistRequests(spaceId);
  const [spaceResponse, loading, , refetch] = useGetSpace(spaceId);
  const [worldSpace] = useGetSpace(currentWorld);
  const [allowedSubspaces] = useSpaceType(spaceId);
  const [, setNodeAdmin] = useState<boolean>();
  const [tokens, , , refetchTokens] = useGetTokens(bytesToUuid(currentWorld));

  useEffect(() => {
    if (worldSpace && worldSpace?.space.spaceType.name === 'World' && worldSpace?.admin) {
      setNodeAdmin(true);
    } else {
      setNodeAdmin(false);
    }
  }, [worldSpace]);

  const getView = () => {
    if (loading) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">Loading data</h2>
          </div>
        </Panel>
      );
    } else if (!loading && spaceResponse && spaceResponse?.admin) {
      // && spaceResponse?.admin
      return (
        <div className="flex w-full gap-1 ">
          {' '}
          {/*/flex gap-1  */}
          <div className="flex gap-1 w-1/2 ">
            <div className="flex flex-col w-1/2 gap-1">
              {' '}
              {/*/${nodeAdmin? "":"flex-col"}  */}
              <MetaPanelView
                space={spaceResponse?.space}
                onUpdate={refetch}
                ancestors={spaceResponse?.ancestors}
              />
              {/* <div className={``}> /${nodeAdmin? "hidden":""} */}
              <TokenManagementView
                whitelists={tokens}
                onUpdate={refetchWhitelist}
                UpdateRules={refetchTokenRules}
                spaceId={spaceId}
                worldId={currentWorld}
              />
              {/* </div> ${worldSpace && worldSpace.admin? " grid-rows-2" : ""}*/}
            </div>
            <div className="flex grid grid-rows-2  grid-flow-col w-1/2 gap-1">
              <TokenRulesPanelView
                whitelists={tokens}
                tokenRulesList={tokenRulesList}
                onUpdate={refetchTokenRules}
                spaceId={spaceId}
              />
              {/* {worldSpace && worldSpace.admin &&  */}
              <WhitelistRequestsPanel
                whitelistItems={whitelistItems}
                onUpdateTokens={refetchTokens}
                onUpdate={refetchWhitelist}
                currentWorld={currentWorld}
              />
            </div>
          </div>
          <div className="flex w-1/2 gap-1">
            <UsersPanelView space={spaceResponse?.space} onUpdate={refetch} />

            {allowedSubspaces && allowedSubspaces.length > 0 && (
              <SpacesPanelView
                space={spaceResponse?.space}
                subspaces={spaceResponse?.children}
                allowedSubspaces={allowedSubspaces}
                parentType={spaceResponse?.spaceType}
                onUpdate={refetch}
              />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">You don't have any access rights to manage this space</h2>
          </div>
        </Panel>
      );
    }
  };

  return (
    <Page
      title={spaceResponse?.space?.name || ''}
      subtitle="Manage Space"
      isAdmin={spaceResponse?.admin}
    >
      {getView()}
    </Page>
  );
};

export default SpaceAdminLayout;

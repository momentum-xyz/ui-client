import {FC, useEffect, Fragment, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton, IconSvg} from '@momentum-xyz/ui-kit';
import {Event3dEmitter, useI18n} from '@momentum-xyz/core';

import {World3dStoreModelInterface} from 'stores/UniverseStore/models';
import {WorldObjectWithChildrenInterface} from 'api';

import * as styled from './SceneExplorer.styled';

const sortByName = (a: WorldObjectWithChildrenInterface, b: WorldObjectWithChildrenInterface) => {
  return a.name.localeCompare(b.name);
};

interface PropsInterface {
  world3dStore: World3dStoreModelInterface;
}

const SceneExplorer: FC<PropsInterface> = ({world3dStore}) => {
  const {fetchWorldTree, worldTree, handleClick, openDeleteObjectDialog, flyToObject} =
    world3dStore;

  useEffect(() => {
    fetchWorldTree();

    Event3dEmitter.on('AddObject', fetchWorldTree);
    Event3dEmitter.on('RemoveObject', fetchWorldTree);

    return () => {
      Event3dEmitter.off('AddObject', fetchWorldTree);
      Event3dEmitter.off('RemoveObject', fetchWorldTree);
    };
  }, [fetchWorldTree]);

  const {t} = useI18n();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  if (!worldTree) {
    return null;
  }

  const renderChildren = (object: WorldObjectWithChildrenInterface, depth = 0) => {
    return Object.values(object.children)
      .sort(sortByName)
      .map((child) => {
        const hasChildren = Object.keys(child.children).length > 0;
        const isExpanded = !!expandedNodes[child.id];
        const expandIcon = (
          <IconButton
            name={isExpanded ? 'chevron_down' : 'chevron_right'}
            isWhite
            size="s"
            onClick={() => {
              setExpandedNodes((prev) => ({
                ...prev,
                [child.id]: !isExpanded
              }));
            }}
          />
        );

        return (
          <Fragment key={child.id}>
            <styled.Item style={{marginLeft: depth * 30}}>
              {hasChildren ? expandIcon : <styled.IconButtonPlaceholder />}
              <IconSvg name="cube" isWhite />
              <styled.ItemNameWithTrunkate title={child.name}>
                {child.name}
              </styled.ItemNameWithTrunkate>
              <styled.ItemActions>
                <IconButton
                  name="fly-to"
                  isWhite
                  onClick={() => {
                    flyToObject(child.id);
                  }}
                />
                <IconButton
                  name="info"
                  isWhite
                  onClick={() => {
                    flyToObject(child.id);
                    handleClick(child.id, 'inspector');
                  }}
                />
                <IconButton
                  name="bin"
                  isWhite
                  onClick={() => {
                    openDeleteObjectDialog(child.id);
                  }}
                />
              </styled.ItemActions>
            </styled.Item>
            {hasChildren && isExpanded && <>{renderChildren(child, depth + 1)}</>}
          </Fragment>
        );
      });
  };

  return (
    <styled.Container>
      <styled.Description>{t('messages.sceneExplorerDescription')}</styled.Description>
      <styled.List>
        <styled.Item>{worldTree.name}</styled.Item>
        {renderChildren(worldTree)}
      </styled.List>
    </styled.Container>
  );
};

export default observer(SceneExplorer);

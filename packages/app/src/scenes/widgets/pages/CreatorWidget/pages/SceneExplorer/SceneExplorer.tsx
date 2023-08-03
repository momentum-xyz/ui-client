import {FC, useEffect, Fragment} from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton, IconSvg} from '@momentum-xyz/ui-kit';
import {Event3dEmitter} from '@momentum-xyz/core';

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
  const {fetchWorldTree, worldTree, handleClick, openDeleteObjectDialog, goToObject} = world3dStore;

  useEffect(() => {
    fetchWorldTree();

    Event3dEmitter.on('AddObject', fetchWorldTree);
    Event3dEmitter.on('RemoveObject', fetchWorldTree);

    return () => {
      Event3dEmitter.off('AddObject', fetchWorldTree);
      Event3dEmitter.off('RemoveObject', fetchWorldTree);
    };
  }, [fetchWorldTree]);

  if (!worldTree) {
    return null;
  }

  const renderChildren = (object: WorldObjectWithChildrenInterface, depth = 0) => {
    return Object.values(object.children)
      .sort(sortByName)
      .map((child) => {
        return (
          <Fragment key={child.id}>
            <styled.Item style={{marginLeft: depth * 32}}>
              <span>&nbsp;</span>
              <IconSvg name="cube" isWhite />
              {child.name}
              <styled.ItemActions>
                <IconButton
                  name="fly-to"
                  isWhite
                  onClick={() => {
                    goToObject(child.id);
                  }}
                />
                <IconButton
                  name="info"
                  isWhite
                  onClick={() => {
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
            {Object.keys(child.children).length > 0 && <>{renderChildren(child, depth + 1)}</>}
          </Fragment>
        );
      });
  };

  return (
    <styled.Container>
      <styled.Description>
        Below is a list of all the 3d assets currently present in your odyssey. From here you can
        quickly fly to an object, delete and object, or make an object visible or invisible.
      </styled.Description>
      <styled.Item>{worldTree.name}</styled.Item>
      <styled.List>{renderChildren(worldTree)}</styled.List>
    </styled.Container>
  );
};

export default observer(SceneExplorer);

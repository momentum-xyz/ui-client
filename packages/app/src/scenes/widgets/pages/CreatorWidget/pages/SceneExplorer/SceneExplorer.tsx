import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {World3dStoreModelInterface} from 'stores/UniverseStore/models';
import {WorldObjectWithChildrenInterface} from 'api';

import * as styled from './SceneExplorer.styled';

const sortByName = (a: WorldObjectWithChildrenInterface, b: WorldObjectWithChildrenInterface) => {
  return a.name.localeCompare(b.name);
};

const renderChildren = (object: WorldObjectWithChildrenInterface) => {
  return Object.values(object.children)
    .sort(sortByName)
    .map((child) => {
      return (
        <styled.Item key={child.id}>
          {child.name}
          {Object.keys(child.children).length > 0 && <div>NESTED: {renderChildren(child)}</div>}
        </styled.Item>
      );
    });
};

interface PropsInterface {
  world3dStore: World3dStoreModelInterface;
}

const SceneExplorer: FC<PropsInterface> = ({world3dStore}) => {
  const {fetchWorldTree, worldTree} = world3dStore;

  useEffect(() => {
    fetchWorldTree();
  }, [fetchWorldTree]);

  if (!worldTree) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Description>
        Below is a list of all the 3d assets currently present in your odyssey. From here you can
        quickly fly to an object, delete and object, or make an object visible or invisible.
      </styled.Description>
      <styled.List>{renderChildren(worldTree)}</styled.List>
    </styled.Container>
  );
};

export default observer(SceneExplorer);

import {useCallback, useRef} from 'react';
import * as THREE from 'three';
import {Map3dUserInterface} from '@momentum-xyz/core';

import {PlanetMesh} from '../classes';

// Define rules for placements of Odysseys.
const circleRadiusIncreaseValue = 10;

export const useUniverse = () => {
  // This is for both staked and non-staked.
  const odysseyGroups = useRef<THREE.Group[]>([]);

  const amountOfRandomOdysseysInNextCircle = useRef(10);
  const standardCircleRadius = useRef(30);
  const ringCounter = useRef(1);

  /**
   * Process and place other odysseys
   */
  const processOtherOdysseys = useCallback((listOfOdysseys: PlanetMesh[]) => {
    // Check if there are enough odyssey left. If not adapt the amount ot the amount that is left.
    if (listOfOdysseys.length < amountOfRandomOdysseysInNextCircle.current) {
      amountOfRandomOdysseysInNextCircle.current = listOfOdysseys.length;
    }

    // Define the distance between Odysseys based on current amount.
    const amount = amountOfRandomOdysseysInNextCircle.current;
    const distanceBetweenOdyssey = 360 / amount;

    // The offset will be increased after setting the XYZ of a Odyssey.
    let offset = 0;

    // Create a ring to add Odysseys to.
    const circle = new THREE.Group();
    circle.name = 'circle' + ringCounter;

    // Calculate the XYZ and place the Odyssey.
    for (let i = 0; i < amountOfRandomOdysseysInNextCircle.current; i++) {
      // Set current Odyssey.
      const currentOdyssey = listOfOdysseys[i];

      // Calculate Radian
      const radian = offset * (Math.PI / 180);

      // new XYZ Vector3
      const placementXYZ = new THREE.Vector3();

      // Calculate the XYZ.
      placementXYZ.x = Math.cos(radian) * standardCircleRadius.current;
      placementXYZ.y = -30;
      placementXYZ.z = Math.sin(radian) * standardCircleRadius.current;

      // Increase the offset for the next Odyssey.
      offset += distanceBetweenOdyssey;

      // Set the position of the current Odyssey.
      currentOdyssey.position.set(placementXYZ.x, placementXYZ.y, placementXYZ.z);

      // Add the current Odyssey to the group.
      circle.add(currentOdyssey);
    }

    // Remove the Odyssey from the array.
    listOfOdysseys.splice(0, amount);

    // Increase the amount to place in the next circle.
    amountOfRandomOdysseysInNextCircle.current = amountOfRandomOdysseysInNextCircle.current * 1.5;

    // Increase the circle radius for the next ring.
    standardCircleRadius.current += circleRadiusIncreaseValue * (ringCounter.current / 2);

    // Increase the ring counter
    ringCounter.current++;

    // Add the circle to the total amount of rings array
    odysseyGroups.current.push(circle);
  }, []);

  /**
   * Place odyssey and build universe
   */
  const placeOdysseyInUniverse = useCallback(
    (listOfOdysseys: PlanetMesh[], user: Map3dUserInterface) => {
      // Combine all arrays related to staking.
      /*const allStakedOdysseys = [
        ...myOdyssey.iStakedInConnections,
        ...myOdyssey.mutualStakedConnections,
        ...myOdyssey.stakedInMeConnections
      ];

      // Collect all actually Odyssey objects in an array.
      const stakedOdysseysObject = [];
      for (let i = 0; i < allStakedOdysseys.length; i++) {
        // Locate the actual Odyssey based on its ID number.
        const found = listOfOdysseys.find((item) => item.number == allStakedOdysseys[i]);
        stakedOdysseysObject.push(found);
      }

      // Remove all StakedOdysseys from the ALL Odysseys array. To prevent duplications
      stakedOdysseysObject.map((item) => {
        const found = listOfOdysseys.find((odyssey) => odyssey == item);
        if (found) {
          // Remove duplicated Odyssey.
          const index = listOfOdysseys.indexOf(found);
          listOfOdysseys.splice(index, 1);
        }
      });*/

      // Process and place the staked Odysseys.
      //while (stakedOdysseysObject.length > 0) {
      //  ProcessStakedOdysseys(myOdyssey, stakedOdysseysObject);
      //}

      // Process and place the Random Odysseys.
      while (listOfOdysseys.length > 0) {
        processOtherOdysseys(listOfOdysseys);
      }

      // The final object for the Universe.
      // Must be returned and added to the scene in the index.js
      const theUniverse = new THREE.Group();

      // Add all circles to the Universe group.
      odysseyGroups.current.forEach((ring) => {
        theUniverse.add(ring);
      });

      return theUniverse;
    },
    [processOtherOdysseys]
  );

  return {placeOdysseyInUniverse};
};

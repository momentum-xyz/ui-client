import {useCallback, useEffect, useRef} from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import {Vector3, RepeatWrapping} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {Map3dUserInterface} from '@momentum-xyz/core';

import {
  PARAMETERS,
  MAX_ORBIT_CAMERA_DISTANCE,
  MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA,
  PLANET_ARE_SPAWNED_HORIZONTAL,
  PLANETS_MAX_VERTICAL_SPAWN_HEIGHT
} from '../contants';
import {PlanetMesh} from '../classes';
import astronaut from '../static/images/astronaut.png';
import BasicSkyboxHD from '../static/images/galaxy.jpg';

export const use3dMap = (
  canvas: HTMLCanvasElement,
  items: Map3dUserInterface[],
  currentUser: Map3dUserInterface,
  getConnections: (wallet: string) => Promise<string[]>,
  getImageUrl: (urlOrHash: string | undefined | null) => string | null,
  onSelectOdyssey: (uuid: string) => void
) => {
  const wasLoaded = useRef(false);
  const animationFrame = useRef(0);

  /**
   * Reusable properties of galaxy
   */
  const odysseyAvatarGeometry = useRef(new THREE.CircleGeometry(0.8, 26));
  const listOfOdysseys = useRef<PlanetMesh[]>([]);
  const referenceListOfOdysseys = useRef<PlanetMesh[]>([]);

  const scene = useRef(new THREE.Scene());
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const backgroundImage = useRef<THREE.Texture>();
  const odysseyBaseSphereGeometry = useRef(new THREE.SphereGeometry(1, 16, 16));
  const odysseyBaseSphereMaterial = useRef<THREE.MeshPhysicalMaterial>();
  const updateCameraRotation = useRef<boolean>(false);
  const transitionToPlanetFinished = useRef<boolean>(true);

  const nameRingGeometry = useRef(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 22, 1, true));
  const nameRingOffset = useRef(0);

  const pointsGeometry = useRef<THREE.BufferGeometry | null>(null);
  const pointsMaterial = useRef<THREE.PointsMaterial | null>(null);
  const points = useRef<THREE.Points | null>(null);

  const aspect = window.innerWidth / window.innerHeight;
  const controls = useRef<OrbitControls>();
  const camera = useRef(new THREE.PerspectiveCamera(75, aspect, 0.1, 10000));
  const renderer = useRef<THREE.WebGLRenderer>();

  const lastSelectedOdyssey = useRef<string>();
  const activeLinesOwner = useRef<string>();
  const activeLines = useRef<Line2[]>([]);
  const defaultOdysseyTexture = useRef(new THREE.TextureLoader().load(astronaut));

  const createTextCanvas = useCallback((name: string) => {
    const drawCanvas = document.createElement('canvas');
    const drawContent = drawCanvas.getContext('2d');
    drawCanvas.width = 1000;
    drawCanvas.height = 100;
    if (drawContent) {
      drawContent.font = 'Bold 40px Trebuchet MS';

      drawContent.fillStyle = 'rgba(0, 0, 0, 0.1)';
      drawContent.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

      drawContent.fillStyle = 'rgba(245, 199, 255, 0.9)';
      drawContent.fillText(`Visit ${name}`, 0, 60);
      drawContent.strokeStyle = 'rgba(124, 86, 133)';
      drawContent.strokeText(`Visit ${name}`, 0, 60);
    }

    return drawCanvas;
  }, []);

  /**
   * Draw lines between staked Odysseys.
   */
  const drawConnections = useCallback(
    async (sourceWallet?: string | null) => {
      if (!sourceWallet) {
        return;
      }

      const targetWallets = await getConnections(sourceWallet);
      const isSameOdyssey = activeLinesOwner.current === sourceWallet;
      const areSameConnections = activeLines.current.length === targetWallets.length;

      if (isSameOdyssey && areSameConnections) {
        return;
      }

      // Delete current connections
      if (activeLines.current.length) {
        for (let i = 0; i < activeLines.current.length; i++) {
          scene.current.remove(activeLines.current[i]);
        }

        activeLines.current = [];
      }

      const sourceOdyssey = referenceListOfOdysseys.current.find(
        (odyssey) => odyssey.owner === sourceWallet
      );

      activeLinesOwner.current = sourceWallet;

      // Draw new connections
      targetWallets.forEach((targetWallet) => {
        // Get the connected Odysseys from global reference
        const targetOdyssey = referenceListOfOdysseys.current.find(
          (odyssey) => odyssey.owner === targetWallet
        );

        if (targetOdyssey && sourceOdyssey) {
          // Create random line height and calculate middle position
          const randomLineHeight = -20;
          const middlePosition = new THREE.Vector3(
            (sourceOdyssey.position.x + targetOdyssey.position.x) / 2,
            randomLineHeight,
            (sourceOdyssey.position.z + targetOdyssey.position.z) / 2
          );

          const direction = new THREE.Vector3();
          direction.subVectors(sourceOdyssey.position, targetOdyssey.position).normalize();
          const startVector = new THREE.Vector3();
          startVector.addVectors(sourceOdyssey.position, direction.multiplyScalar(-0.7));

          const newY = sourceOdyssey.position.y - 0.8;
          startVector.y = newY;
          const secondVector = new THREE.Vector3(startVector.x, newY - 1, startVector.z);

          // Create the curve
          const curve = new THREE.CubicBezierCurve3(
            startVector,
            secondVector,
            middlePosition,
            targetOdyssey.position
          );

          // Get XYZ along the curve.
          const curvePoints = curve.getSpacedPoints(50);

          // Prepare array of numbers for line geometry (doesn't accept vectors)
          const linePoints = [];

          // Build the array for Line from curve Points.
          for (let i = 0; i < curvePoints.length; i++) {
            linePoints.push(curvePoints[i].x, curvePoints[i].y, curvePoints[i].z);
          }

          const lineGeometry = new LineGeometry();
          const lineMaterial = new LineMaterial({
            color: 0xdda4de,
            linewidth: 2,
            transparent: true,
            opacity: 0.5
          });

          lineGeometry.setPositions(linePoints);
          lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

          const drawLine = new Line2(lineGeometry, lineMaterial);

          // Add line to the scene.
          activeLines.current.push(drawLine);
          scene.current.add(drawLine);
        }
      });
    },
    [getConnections]
  );

  /**
   * Change an image of existing odyssey
   */
  const changeOdysseyImage = useCallback((uuid: string, imageUrl: string) => {
    const targetOdyssey = referenceListOfOdysseys.current.find((i) => i.uuid === uuid);
    if (targetOdyssey) {
      const texture = new THREE.TextureLoader().load(imageUrl, undefined, undefined, () => {
        texture.image = defaultOdysseyTexture.current.image;
        texture.needsUpdate = true;
      });

      if (targetOdyssey.children[0] instanceof THREE.Mesh) {
        targetOdyssey.children[0].material.map = texture;
        targetOdyssey.children[0].material.needsUpdate = true;
      }
    }
  }, []);

  /**
   * Change a name of existing odyssey
   */
  const changeOdysseyName = useCallback(
    (uuid: string, name: string) => {
      const targetOdyssey = referenceListOfOdysseys.current.find((i) => i.uuid === uuid);
      if (targetOdyssey && targetOdyssey.children[1] instanceof THREE.Mesh) {
        const drawCanvas = createTextCanvas(name);

        const nameTexture = new THREE.Texture(drawCanvas);
        nameTexture.needsUpdate = true;

        targetOdyssey.children[1].material.map = nameTexture;
        targetOdyssey.children[1].material.map.wrapS = RepeatWrapping;
        targetOdyssey.children[1].material.needsUpdate = true;
      }
    },
    [createTextCanvas]
  );

  /**
   * Build Galaxy
   */
  const generateGalaxy = useCallback(() => {
    // Clean previous renders of galaxy.
    if (points.current !== null) {
      pointsGeometry.current?.dispose();
      pointsMaterial.current?.dispose();
      scene.current.remove(points.current);
    }

    // Geometry
    pointsGeometry.current = new THREE.BufferGeometry();
    const position = new Float32Array(PARAMETERS.count * 3);

    for (let i = 0; i < PARAMETERS.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * PARAMETERS.radius;
      const spinAngle = radius * PARAMETERS.spin;
      const branchAngle = ((i % PARAMETERS.branches) / PARAMETERS.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), PARAMETERS.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), PARAMETERS.randomnesPower) *
        (Math.random() < 0.5 ? PARAMETERS.YHeight : -PARAMETERS.YHeight);
      const randomZ =
        Math.pow(Math.random(), PARAMETERS.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);

      position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      position[i3 + 1] = randomY;
      position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    pointsGeometry.current.setAttribute('position', new THREE.BufferAttribute(position, 3));

    // Material
    pointsMaterial.current = new THREE.PointsMaterial({
      size: PARAMETERS.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xff5588,
      transparent: true,
      opacity: 0.5
    });

    // Create stars in the universe.
    points.current = new THREE.Points(pointsGeometry.current, pointsMaterial.current);
    scene.current.add(points.current);
  }, []);

  /**
   * Create a new Odyssey
   */
  const createNewOdyssey = useCallback(
    (item: Map3dUserInterface) => {
      const imageUrl = getImageUrl(item.image) || astronaut;
      const texture = new THREE.TextureLoader().load(imageUrl, undefined, undefined, () => {
        // Using default image of odyssey if an image was not loaded
        texture.image = defaultOdysseyTexture.current.image;
        texture.needsUpdate = true;
      });

      const odysseyAvatarMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture
      });

      // Flip textures horizontally so text is readable.
      texture.wrapS = THREE.RepeatWrapping;

      const avatarMesh = new THREE.Mesh(odysseyAvatarGeometry.current, odysseyAvatarMaterial);

      // Create custom material for name ring.
      const nameRingMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.DoubleSide
      });

      // Construct odyssey ring mesh.
      const nameRingMesh = new THREE.Mesh(nameRingGeometry.current, nameRingMaterial);

      /**
       * Build text texture for around the odyssey
       */

      const drawCanvas = createTextCanvas(item.name);
      const nameTexture = new THREE.Texture(drawCanvas);
      nameTexture.needsUpdate = true;

      nameRingMesh.material.map = nameTexture;
      nameRingMesh.material.map.wrapS = RepeatWrapping;

      const odyssey = new PlanetMesh(
        odysseyBaseSphereGeometry.current,
        odysseyBaseSphereMaterial.current!,
        item.uuid,
        item.owner,
        item.name,
        texture,
        nameRingMaterial
      );

      odyssey.add(avatarMesh);
      odyssey.add(nameRingMesh);

      return odyssey;
    },
    [createTextCanvas, getImageUrl]
  );

  /**
   * Update an existing Odyssey
   */
  const updateOdyssey = useCallback(
    (item: Map3dUserInterface) => {
      changeOdysseyName(item.uuid, item.name);
      changeOdysseyImage(item.uuid, getImageUrl(item.image) || '');
    },
    [changeOdysseyImage, changeOdysseyName, getImageUrl]
  );

  /**
   * Create center Odyssey
   */
  const createCenterOdyssey = useCallback(() => {
    const centerItem = items.find((i) => i.owner === currentUser.owner);
    if (centerItem) {
      const centerOdyssey = createNewOdyssey(centerItem);

      referenceListOfOdysseys.current.push(centerOdyssey);
      scene.current.add(centerOdyssey);
    }
  }, [currentUser, createNewOdyssey, items]);

  /**
   * Create array for odyssey
   */
  const createOdysseys = useCallback(() => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].owner !== currentUser.owner) {
        const odyssey = createNewOdyssey(items[i]);
        if (odyssey) {
          listOfOdysseys.current.push(odyssey);
          referenceListOfOdysseys.current.push(odyssey);
        }
      }
    }
  }, [currentUser, createNewOdyssey, items]);

  /**
   * Create Circular Universe of Odysseys
   */
  const buildUniverse = useCallback(() => {
    let radius = 10;
    const radiusIncreaseValue = 15;
    let AmountOfOdysseyInNextRing = 10;
    let ringCount = 1;
    const odysseyGroups: THREE.Group[] = [];

    // Build circles in groups.
    function createRing() {
      // if amount to be spawned bigger than available odyssey
      if (listOfOdysseys.current.length < AmountOfOdysseyInNextRing) {
        AmountOfOdysseyInNextRing = listOfOdysseys.current.length;
      }

      const degreeBetweenOdyssey = 360 / AmountOfOdysseyInNextRing;
      let offset = 0;
      let currentOdyssey;

      const odysseyCircle = new THREE.Group();
      odysseyCircle.name = 'circle' + ringCount;

      // Fill circle with odysseys.
      for (let i = 0; i < AmountOfOdysseyInNextRing; i++) {
        currentOdyssey = listOfOdysseys.current[i];
        const radian = offset * (Math.PI / 180);
        offset += degreeBetweenOdyssey;

        const newX = Math.cos(radian) * radius;
        let newY;
        if (PLANET_ARE_SPAWNED_HORIZONTAL) {
          newY = 0;
        } else {
          newY =
            Math.random() * PLANETS_MAX_VERTICAL_SPAWN_HEIGHT -
            PLANETS_MAX_VERTICAL_SPAWN_HEIGHT / 2;
        }
        const newZ = Math.sin(radian) * radius;

        currentOdyssey.position.set(newX, newY, newZ);

        odysseyCircle.add(currentOdyssey);
      }

      listOfOdysseys.current.splice(0, AmountOfOdysseyInNextRing);

      radius += radiusIncreaseValue * (ringCount / 2);
      AmountOfOdysseyInNextRing = AmountOfOdysseyInNextRing * 1.5;
      ringCount++;

      // Add newly created ring of odysseys to the array.
      odysseyGroups.push(odysseyCircle);
    }

    // Trigger While loop posting all odyssey.
    while (listOfOdysseys.current.length > 0) {
      createRing();
    }

    // Add all odyssey rings to the scene.
    odysseyGroups.forEach((circle) => {
      scene.current.add(circle);
    });
  }, []);

  /**
   * Animation
   */
  const animate = useCallback(() => {
    // Animate the textures of all ringNameMaterials.
    nameRingOffset.current += Math.sin(0.001);
    for (let i = 0; i < referenceListOfOdysseys.current.length; i++) {
      const material = referenceListOfOdysseys.current[i].nameRingMaterial;
      if (material.map?.offset) {
        material.map.offset.x = nameRingOffset.current;
      }
    }

    // Update controls for auto-rotate.
    if (!updateCameraRotation.current && controls.current) {
      controls.current.update();
    }

    // Make all avatars face the camera.
    for (let i = 0; i < referenceListOfOdysseys.current.length; i++) {
      const odyssey = referenceListOfOdysseys.current[i].children;
      odyssey[0].lookAt(camera.current.position);
    }

    // Render the scene
    if (renderer.current) {
      renderer.current.render(scene.current, camera.current);
    }

    // Re-call Animation
    animationFrame.current = window.requestAnimationFrame(animate);
  }, []);

  /**
   * Fly to particular planet
   */
  const flyToOdyssey = useCallback(
    async (uuid: string) => {
      // Make sure transition to the newly clicked planet has finished.
      if (!transitionToPlanetFinished.current) {
        return;
      }

      // If clicked planet is same as current selected one return
      if (uuid === lastSelectedOdyssey.current) {
        // Handle selecting planet again
        onSelectOdyssey(uuid);
        return;
      }

      const targetPlanet = referenceListOfOdysseys.current.find((item) => item.uuid === uuid);
      if (!targetPlanet) {
        return;
      }

      lastSelectedOdyssey.current = uuid;

      // Draw connections for target odyssey
      await drawConnections(targetPlanet.owner);

      const targetVector = new THREE.Vector3();
      targetPlanet.getWorldPosition(targetVector);

      // Prepare fly to planets.
      const targetPlanetLocation = new Vector3(targetVector.x, targetVector.y, targetVector.z);

      // Prepare rotation of camera animation.
      const startOrientation = camera.current.quaternion.clone();
      camera.current.lookAt(targetVector);
      const targetOrientation = camera.current.quaternion.clone().normalize();

      // Get the direction for the new location.
      const direction = new THREE.Vector3();
      direction.subVectors(targetVector, camera.current.position).normalize();

      // Get distance from raycast minus minimal distance orbit control
      // const distance = targetPlanet.distance - minimalDistanceToPlanetForCamera;
      const targetVectorForDistance = new Vector3(targetVector.x, targetVector.y, targetVector.z);
      const distance =
        targetVectorForDistance.distanceTo(camera.current.position) -
        MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA;

      // Create new target for the camera.
      const targetLocation = new THREE.Vector3();
      targetLocation.addVectors(camera.current.position, direction.multiplyScalar(distance));

      // Animate using gsap module.
      gsap.to(camera.current.position, {
        duration: 1.5,
        x: targetLocation.x,
        y: targetLocation.y,
        z: targetLocation.z,

        onStart: function () {
          if (controls.current) {
            transitionToPlanetFinished.current = false;
            updateCameraRotation.current = true;
            controls.current.enabled = false;
            controls.current.autoRotate = false;
            controls.current.enablePan = false;
          }
        },
        onUpdate: function () {
          camera.current.quaternion
            .copy(startOrientation)
            .slerp(targetOrientation, this.progress());
        },
        onComplete: function () {
          if (controls.current) {
            updateCameraRotation.current = false;
            controls.current.enabled = true;
            controls.current.enablePan = true;
            controls.current.autoRotate = true;
            controls.current.target = targetPlanetLocation;
            transitionToPlanetFinished.current = true;

            // Handle selecting planet
            onSelectOdyssey(uuid);
          }
        }
      });
    },
    [drawConnections, onSelectOdyssey]
  );

  /**
   * Update mouse location on screen
   */
  const onPointerMove = useCallback((event: PointerEvent) => {
    pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  /**
   * Select planet handler
   */
  const onMouseDown = useCallback(
    async (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      // Create Raycast
      raycaster.current.setFromCamera(pointer.current, camera.current);
      const castRay = raycaster.current.intersectObjects(referenceListOfOdysseys.current, false);

      // Process the Raycast.
      if (castRay.length > 0) {
        // Only react to first raycast hit
        const targetPlanet = castRay[0];

        // Fly to founded planet
        await flyToOdyssey(targetPlanet.object.uuid);
      }
    },
    [flyToOdyssey]
  );

  /**
   * On window resize handler
   */
  const onWindowResize = useCallback(() => {
    if (camera.current && renderer.current) {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  const clear3dScene = useCallback(() => {
    window.cancelAnimationFrame(animationFrame.current);

    while (scene.current.children.length > 0) {
      scene.current.remove(scene.current.children[0]);
    }
  }, []);

  useEffect(() => {
    if (wasLoaded.current) {
      return;
    }

    // Prevent double rendering
    wasLoaded.current = true;

    // Camera Setup
    camera.current.position.set(15, 20, 2);
    camera.current.lookAt(0, 0, 0);
    scene.current.add(camera.current);

    // Light Setup
    const ambient = new THREE.AmbientLight(0x404040, 5);
    scene.current.add(ambient);

    // Renderer Setup
    renderer.current = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.current.setClearColor(0x222222);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);

    // Orbit Controls setup
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = 0.3;
    controls.current.enableDamping = true;
    controls.current.enablePan = true;
    controls.current.maxDistance = MAX_ORBIT_CAMERA_DISTANCE;
    controls.current.minDistance = MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA;
    controls.current.zoomSpeed = 1;

    // Happy ship skybox
    backgroundImage.current = new THREE.TextureLoader().load(BasicSkyboxHD);
    backgroundImage.current.mapping = THREE.EquirectangularReflectionMapping;
    scene.current.background = backgroundImage.current;

    // Setup all base materials and geometries.
    odysseyBaseSphereMaterial.current = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      envMap: backgroundImage.current,
      transmission: 1,
      opacity: 0.3,
      side: THREE.BackSide,
      ior: 1.5,
      metalness: 0.3,
      roughness: 0,
      specularIntensity: 1,
      transparent: true
    });

    generateGalaxy();

    createOdysseys();

    createCenterOdyssey();

    drawConnections(currentUser.owner);

    buildUniverse();

    animate();
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', onWindowResize, false);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', onWindowResize, false);
    };
  }, [onMouseDown, onPointerMove, onWindowResize]);

  return {flyToOdyssey, updateOdyssey, clear3dScene};
};

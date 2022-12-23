import {useCallback, useEffect, useRef} from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import {Vector3, RepeatWrapping} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {
  PARAMETERS,
  MAX_ODYSSEY_CONNECTION_LINE_HEIGHT,
  MAX_ORBIT_CAMERA_DISTANCE,
  MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA,
  PLANET_ARE_SPAWNED_HORIZONTAL,
  PLANETS_MAX_VERTICAL_SPAWN_HEIGHT
} from '../contants';
import {PlanetMesh} from '../classes';
import {PlanetInterface} from '../interfaces';
import honey01 from '../static/images/honey01.jpg';
import iceland01 from '../static/images/iceland01.jpg';
import BasicSkyboxHD from '../static/images/BasicSkyboxHD.jpg';

export const use3dMap = (
  canvas: HTMLCanvasElement,
  items: PlanetInterface[],
  centerUuid: string,
  getImageUrl: (urlOrHash: string | undefined | null) => string | null,
  onSelectOdyssey: (uuid: string) => void
) => {
  const wasLoaded = useRef(false);

  /**
   * Reusable properties of galaxy
   */
  const odysseyAvatarGeometry = useRef(new THREE.CircleGeometry(0.8, 26));
  const listOfOdysseys = useRef<PlanetMesh[]>([]);
  const referenceListOfOdysseys = useRef<PlanetMesh[]>([]);
  const selectedOdyssey = useRef<THREE.Object3D<THREE.Event>>();

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
  const camera = useRef(new THREE.PerspectiveCamera(75, aspect, 0.1, 10000));
  const renderer = useRef(
    new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    })
  );
  const controls = useRef(new OrbitControls(camera.current, renderer.current.domElement));

  /**
   * Draw lines between staked Odysseys.
   */
  const drawConnections = useCallback((connections: Record<string, {id: string}[]>) => {
    // setup reusable variables and material
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    });

    Object.entries(connections).forEach(([uuid, connectedUuids]) => {
      const odyssey = referenceListOfOdysseys.current.find((item) => item.uuid === uuid);
      if (odyssey && connectedUuids?.length > 0) {
        connectedUuids.forEach((connectedUuid) => {
          // Get positions from connected odyssey and draw line.
          const foundOdyssey = referenceListOfOdysseys.current.find(
            (planet) => planet.uuid === connectedUuid.id
          );

          if (foundOdyssey) {
            const randomLineHeight =
              Math.random() * MAX_ODYSSEY_CONNECTION_LINE_HEIGHT * (Math.random() > 0.5 ? 1 : -1);
            const middlePosition = new Vector3(
              (odyssey.position.x + foundOdyssey.position.x) / 2,
              randomLineHeight,
              (odyssey.position.z + foundOdyssey.position.z) / 2
            );

            const curve = new THREE.QuadraticBezierCurve3(
              odyssey.position,
              middlePosition,
              foundOdyssey.position
            );

            const curvePoints = curve.getSpacedPoints(20);
            const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
            const curveMesh = new THREE.Line(curveGeometry, lineMat);
            scene.current.add(curveMesh);
          }
        });
      }
    });
  }, []);

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

      position[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
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
    (item: PlanetInterface) => {
      const standardTextures = [honey01, iceland01];

      const randNum = Math.floor(Math.random() * standardTextures.length);
      let randTexture = standardTextures[randNum];

      if (item.image) {
        randTexture = getImageUrl(item.image);
      }

      const texture = new THREE.TextureLoader().load(randTexture);

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
      const drawCanvas = document.createElement('canvas');
      const drawContent = drawCanvas.getContext('2d');
      drawCanvas.width = 1000;
      drawCanvas.height = 100;
      if (drawContent) {
        drawContent.font = 'Bold 40px IBM Plex Sans';

        drawContent.fillStyle = 'rgba(0, 0, 0, 0.1)';
        drawContent.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

        drawContent.fillStyle = 'rgba(245, 199, 255, 0.9)';
        drawContent.fillText(`Visit ${item.name}`, 0, 60);
        drawContent.strokeStyle = 'rgba(124, 86, 133)';
        drawContent.strokeText(`Visit ${item.name}`, 0, 60);
      }

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
    [getImageUrl]
  );

  /**
   * Create array for odyssey
   */
  const createOdysseys = useCallback(() => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].uuid !== centerUuid) {
        const odyssey = createNewOdyssey(items[i]);
        if (odyssey) {
          listOfOdysseys.current.push(odyssey);
        }
      }
    }

    referenceListOfOdysseys.current = [...listOfOdysseys.current];
  }, [centerUuid, createNewOdyssey, items]);

  /**
   * Create center Odyssey
   */
  const createCenterOdyssey = useCallback(() => {
    const centerItem = items.find((i) => i.uuid === centerUuid);
    if (!centerItem) {
      return;
    }

    const centerOdyssey = createNewOdyssey(centerItem);
    scene.current.add(centerOdyssey);
    referenceListOfOdysseys.current.push(centerOdyssey);
  }, [centerUuid, createNewOdyssey, items]);

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
    if (!updateCameraRotation.current) {
      controls.current.update();
    }

    // Make all avatars face the camera.
    for (let i = 0; i < referenceListOfOdysseys.current.length; i++) {
      const odyssey = referenceListOfOdysseys.current[i].children;
      odyssey[0].lookAt(camera.current.position);
    }

    // Render the scene
    renderer.current.render(scene.current, camera.current);

    // Re-call Animation
    window.requestAnimationFrame(animate);
  }, []);

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
    (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      // Create Raycast
      raycaster.current.setFromCamera(pointer.current, camera.current);
      const castRay = raycaster.current.intersectObjects(referenceListOfOdysseys.current, false);

      // Process the Raycast.
      if (castRay.length > 0) {
        // Make sure transition to the newly clicked planet has finished.
        if (!transitionToPlanetFinished.current) {
          return;
        }

        // Only react to first raycast hit
        const targetPlanet = castRay[0];

        // Handle selecting planet
        onSelectOdyssey(targetPlanet.object.uuid);

        // If clicked planet is same as current selected one return
        if (targetPlanet.object === selectedOdyssey.current) {
          return;
        }

        // Log information about selected Odyssey
        console.log(targetPlanet.object);

        selectedOdyssey.current = targetPlanet.object;

        const targetVector = new THREE.Vector3();
        targetPlanet.object.getWorldPosition(targetVector);

        // Prepare fly to planets.
        const targetPlanetLocation = new Vector3(targetVector.x, targetVector.y, targetVector.z);

        // Prepare rotation of camera animation.
        const startOrientation = camera.current.quaternion.clone();

        const targetOrientation = camera.current.quaternion
          // @ts-ignore: artifacts appear without it.
          .clone(camera.current.lookAt(targetVector))
          .normalize();

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
            transitionToPlanetFinished.current = false;
            updateCameraRotation.current = true;
            controls.current.enabled = false;
            controls.current.autoRotate = false;
            controls.current.enablePan = false;
          },
          onUpdate: function () {
            camera.current.quaternion
              .copy(startOrientation)
              .slerp(targetOrientation, this.progress());
          },
          onComplete: function () {
            updateCameraRotation.current = false;
            controls.current.enabled = true;
            controls.current.enablePan = true;
            controls.current.autoRotate = true;
            controls.current.target = targetPlanetLocation;
            transitionToPlanetFinished.current = true;
          }
        });
      }
    },
    [onSelectOdyssey]
  );

  /**
   * On window resize handler
   */
  const onWindowResize = useCallback(() => {
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
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
    renderer.current.setClearColor(0x222222);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);

    // Orbit Controls setup
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

    buildUniverse();

    animate();
  }, [animate, buildUniverse, createCenterOdyssey, createOdysseys, generateGalaxy]);

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

  return {drawConnections};
};

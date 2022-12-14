import gsap from 'gsap';
import * as THREE from 'three';
import {Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import {PlanetMesh} from '../classes';
import {PlanetInterface} from '../interfaces';
import {
  PARAMETERS,
  MAX_ODYSSEY_CONNECTION_LINE_HEIGHT,
  MAX_ORBIT_CAMERA_DISTANCE,
  MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA,
  PLANET_ARE_SPAWNED_HORIZONTAL,
  PLANETS_MAX_VERTICAL_SPAWN_HEIGHT
} from '../contants';
// @ts-ignore
import honey01 from '../static/images/honey01.jpg';
// @ts-ignore
import iceland01 from '../static/images/iceland01.jpg';
// @ts-ignore
import BasicSkyboxHD from '../static/images/BasicSkyboxHD.jpg';

let wasLoaded = false;

// TODO: Kovi
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let selectedOdyssey: THREE.Object3D<THREE.Event>;
let referenceListOfOdysseys: PlanetMesh[] = [];

export const use3DMap = (
  canvas: HTMLCanvasElement,
  items: PlanetInterface[],
  centerUuid: string | undefined | null,
  getImageUrl: (urlOrHash: string | undefined | null) => string | null,
  onOdysseyClick: (uuid: string) => void
) => {
  const odysseyAvatarGeometry = new THREE.CircleGeometry(0.8, 26);

  const listOfOddyseys: PlanetMesh[] = [];

  /**
   * Draw lines between staked Odysseys.
   */

  const drawConnections = (connections: Record<string, {id: string}[]>) => {
    // setup reusable variables and material
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    });

    Object.entries(connections).forEach(([uuid, connectedUuids]) => {
      const odyssey = referenceListOfOdysseys.find((item) => item.uuid === uuid);
      if (odyssey && connectedUuids?.length > 0) {
        connectedUuids.forEach((connectedUuid) => {
          // Get positions from connected odyssey and draw line.
          const foundOdyssey = referenceListOfOdysseys.find(
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
            scene.add(curveMesh);
          }
        });
      }
    });
  };

  // FIXME: Kovi
  if (!wasLoaded) {
    wasLoaded = true;
  } else {
    return {
      drawConnections,
      changeWasLoaded: () => {
        wasLoaded = false;
      }
    };
  }

  // TODO: Kovi
  const createNewOdyssey = (item?: PlanetInterface) => {
    if (!item) {
      return;
    }

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
    //texture.repeat.x = - 1;

    const avatarMesh = new THREE.Mesh(odysseyAvatarGeometry, odysseyAvatarMaterial);

    const odyssey = new PlanetMesh(
      odysseyBaseSphereGeometry,
      odysseyBaseSphereMaterial,
      item.uuid,
      item.owner,
      item.name,
      texture
    );

    odyssey.add(avatarMesh);

    return odyssey;
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const gui = new dat.GUI();
  let updateCameraRotation = false;
  gui.hide();
  let transitionToPlanetFinished = true;

  // TODO: Kovi
  // Scene setup
  scene = new THREE.Scene();

  // Camera Setup
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
  camera.position.set(15, 20, 2);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Light Setup
  const ambient = new THREE.AmbientLight(0x404040, 5);
  scene.add(ambient);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x222222);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Orbit Controls setup
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.maxDistance = MAX_ORBIT_CAMERA_DISTANCE;
  controls.minDistance = MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA;
  controls.zoomSpeed = 1;

  /**
   * Happyship skybox
   */

  const backgroundImage = new THREE.TextureLoader().load(BasicSkyboxHD);
  backgroundImage.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = backgroundImage;

  // Setup all base materials and geometries.
  const odysseyBaseSphereGeometry = new THREE.SphereGeometry(1, 16, 16);

  const odysseyBaseSphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    envMap: backgroundImage,
    transmission: 1,
    opacity: 0.3,
    side: THREE.BackSide,
    ior: 1.5,
    metalness: 0.3,
    roughness: 0,
    specularIntensity: 1,
    // @ts-ignore
    transparentA: true
  });

  /**
   * Build Galaxy
   */

  let pointsGeometry: THREE.BufferGeometry | null = null;
  let pointsMaterial: THREE.PointsMaterial | null = null;
  let points: THREE.Points | null = null;

  const generateGalaxy = () => {
    /**
     * Clean previous renders of galaxy.
     */
    if (points !== null && !!pointsGeometry && !!pointsMaterial) {
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      scene.remove(points);
    }

    /**
     * Geometry
     */
    pointsGeometry = new THREE.BufferGeometry();
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

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    /**
     * Material
     */
    pointsMaterial = new THREE.PointsMaterial({
      size: PARAMETERS.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xff5588,
      transparent: true,
      opacity: 0.5
    });

    /**
     * Create stars in the universe.
     */
    points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
  };

  generateGalaxy();

  gui.add(PARAMETERS, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'radius').min(1).max(500).step(1).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'spin').min(-3).max(3).step(0.1).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'randomnes').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'randomnesPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
  gui.add(PARAMETERS, 'YHeight').min(1).max(150).step(1).onFinishChange(generateGalaxy);

  // update mouse location on screen
  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Onclick event

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    // Create Raycast
    raycaster.setFromCamera(pointer, camera);
    const castRay = raycaster.intersectObjects(referenceListOfOdysseys, false);

    // Process the Raycast.
    if (castRay.length > 0) {
      // Make sure transition to the newly clicked planet has finished.
      if (!transitionToPlanetFinished) {
        return;
      }

      // Only react to first raycast hit

      const targetPlanet = castRay[0];

      // If clicked planet is same as current selected one return
      if (targetPlanet.object === selectedOdyssey) {
        return;
      }

      // Log information about selected Odyssey
      console.log(targetPlanet.object);

      selectedOdyssey = targetPlanet.object;

      const targetVector = new THREE.Vector3();
      targetPlanet.object.getWorldPosition(targetVector);

      // FIXME: Kovi. Extract info from planet Kovi
      onOdysseyClick(targetPlanet.object.uuid);

      // Prepare fly to planets.
      const targetPlanetLocation = new Vector3(targetVector.x, targetVector.y, targetVector.z);

      // Prepare rotation of camera animation.
      const startOrientation = camera.quaternion.clone();

      // @ts-ignore
      const targetOrientation = camera.quaternion.clone(camera.lookAt(targetVector)).normalize();

      // Get the direction for the new location.
      const direction = new THREE.Vector3();
      direction.subVectors(targetVector, camera.position).normalize();

      // Get distance from raycast minus minimal distance orbit control
      // const distance = targetPlanet.distance - minimalDistanceToPlanetForCamera;
      const targetVectorForDistance = new Vector3(targetVector.x, targetVector.y, targetVector.z);
      const distance =
        targetVectorForDistance.distanceTo(camera.position) - MINIMUM_DISTANCE_TO_PLANET_FOR_CAMERA;

      // Create new target for the camera.
      const targetLocation = new THREE.Vector3();
      targetLocation.addVectors(camera.position, direction.multiplyScalar(distance));

      //Animate using gsap module.
      gsap.to(camera.position, {
        duration: 1.5,
        x: targetLocation.x,
        y: targetLocation.y,
        z: targetLocation.z,

        onStart: function () {
          transitionToPlanetFinished = false;
          updateCameraRotation = true;
          controls.enabled = false;
          controls.autoRotate = false;
          controls.enablePan = false;
        },
        onUpdate: function () {
          camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
        },
        onComplete: function () {
          updateCameraRotation = false;
          controls.enabled = true;
          controls.enablePan = true;
          controls.autoRotate = true;
          controls.target = targetPlanetLocation;
          transitionToPlanetFinished = true;
        }
      });
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('mousedown', onMouseDown);

  /**
   * Create test array for odyssey
   */

  // TODO: Kovi
  const ProcessOdyssey = () => {
    //Build an odyssey for all given entries.
    for (let i = 0; i < items.length; i++) {
      if (items[i].uuid !== centerUuid) {
        const odyssey = createNewOdyssey(items[i]);
        if (odyssey) {
          listOfOddyseys.push(odyssey);
        }
      }
    }

    referenceListOfOdysseys = [...listOfOddyseys];
  };

  ProcessOdyssey();

  /**
   * Create USER OWN odyssey at the center.
   */

  // TODO: Kovi
  const centerOdyssey = createNewOdyssey(items.find((i) => i.uuid === centerUuid));
  if (centerOdyssey) {
    scene.add(centerOdyssey);
    referenceListOfOdysseys.push(centerOdyssey);
  }

  /**
   * Create Circular Universe of Odysseys
   */

  const buildUniverse = () => {
    let radius = 10;
    const radiusIncreaseValue = 15;
    let AmountOfOdysseyInNextRing = 10;
    let ringCount = 1;
    const odysseyGroups: THREE.Group[] = [];

    // Build circles in groups.
    function createRing() {
      // if amount to be spawned bigger than available odyssey
      if (listOfOddyseys.length < AmountOfOdysseyInNextRing) {
        AmountOfOdysseyInNextRing = listOfOddyseys.length;
      }

      const degreeBetweenOdyssey = 360 / AmountOfOdysseyInNextRing;
      let offset = 0;
      let currentOdyssey;

      const odysseyCircle = new THREE.Group();
      odysseyCircle.name = 'circle' + ringCount;

      // Fill circle with odysseys.
      for (let i = 0; i < AmountOfOdysseyInNextRing; i++) {
        currentOdyssey = listOfOddyseys[i];
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

      listOfOddyseys.splice(0, AmountOfOdysseyInNextRing);

      radius += radiusIncreaseValue * (ringCount / 2);
      AmountOfOdysseyInNextRing = AmountOfOdysseyInNextRing * 1.5;
      ringCount++;

      // Add newly created ring of odysseys to the array.
      odysseyGroups.push(odysseyCircle);
    }

    /** Trigger While loop posting all odyssey. */
    while (listOfOddyseys.length > 0) {
      createRing();
    }

    // Add all odyssey rings to the scene.
    odysseyGroups.forEach((circle) => {
      scene.add(circle);
    });
  };

  buildUniverse();

  // Animation
  function animate() {
    // Update controls for auto-rotate.
    if (!updateCameraRotation) {
      controls.update();
    }

    // Make all avatars face the camera.
    for (let i = 0; i < referenceListOfOdysseys.length; i++) {
      const odyssey = referenceListOfOdysseys[i].children;
      odyssey[0].lookAt(camera.position);
    }

    // Render the scene
    renderer.render(scene, camera);

    // Re-call Animation
    window.requestAnimationFrame(animate);
  }

  // On window resize:
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // EventListeners.
  window.addEventListener('resize', onWindowResize, false);

  animate();

  return {
    drawConnections,
    changeWasLoaded: () => {
      wasLoaded = false;
    }
  };
};

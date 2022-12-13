/* eslint-disable */
// @ts-nocheck

// FIXME: Refactoring !!! After 6th !!!

import gsap from 'gsap';
import * as THREE from 'three';
import {Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import {PlanetInterface} from '../interfaces';

import baseAtmos from '../static/images/baseAtmos.jpg';
import temptations from '../static/images/temptations.jpg';
import showTime from '../static/images/showTime.jpg';
import honey01 from '../static/images/honey01.jpg';
import iceland01 from '../static/images/iceland01.jpg';
import BasicSkyboxHD from '../static/images/BasicSkyboxHD.jpg';

class Odyssey extends THREE.Mesh {
  constructor(geometry, material, uuid, wallet, name, url) {
    super(geometry, material);

    this.material = material;
    this.geometry = geometry;
    this.uuid = uuid;
    this.wallet = wallet;
    this.name = name;
    this.url = url;
    this.isOdyssey = true;
  }

  connectedOdysseys = [];

  /**
   * Generating random Connection for vizualisation of connections.
   * DELETE THIS LATER.
   */
  randomConnection = (maxAmount) => {
    let amountToGenerate = 1; //Math.floor(Math.random() * 1);
    for (let i = 0; i < amountToGenerate; i++) {
      let object = {
        id: Math.floor(Math.random() * maxAmount)
      };
      this.connectedOdysseys.push(object);
    }
  };
}

let wasLoaded = false;

// TODO: Kovi
let scene, renderer, controls, selectedOdyssey;
let referenceListOfOdysseys = [];

export const use3DMap = (
  canvas: HTMLCanvasElement,
  items: PlanetInterface[],
  centerUuid: string | undefined | null,
  getImageUrl: (urlOrHash: string | undefined | null) => string | null,
  onOdysseyClick: (uuid: string) => void
) => {
  let AmountOfGalaxyToGenereate = 200;
  let maxOdysseyConnectionLineHeight = 20;
  let MaxOrbitCameraDistance = 200;
  let planetAreSpawnedHorizontal = false;
  let planetsMaxVerticalSpawnHeight = 100;
  const minimalDistanceToPlanetForCamera = 5;

  const odysseyAvatarGeometry = new THREE.CircleGeometry(0.8, 26);

  let listOfOddyseys = [];

  /**
   * Draw lines between staked Odysseys.
   */

  const drawConnections = (connections: Record<string, {id: string}[]>) => {
    // setup reusable variables and material
    let vectorsForLine = [];
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    });

    Object.entries(connections).forEach(([uuid, connectedUuids]) => {
      const odyssey = referenceListOfOdysseys.find((item) => item.uuid === uuid);
      if (odyssey && connectedUuids?.length > 0) {
        connectedUuids.forEach((connectedUuid) => {
          vectorsForLine = []; //clean for next line.

          // Get positions from connected odyssey and draw line.
          const foundOdyssey = referenceListOfOdysseys.find(
            (planet) => planet.uuid === connectedUuid.id
          );

          if (foundOdyssey) {
            const randomLineHeight =
              Math.random() * maxOdysseyConnectionLineHeight * (Math.random() > 0.5 ? 1 : -1);
            let middlePosition = new Vector3(
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

    const standardTextures = [baseAtmos, temptations, showTime, honey01, iceland01];

    const randNum = Math.floor(Math.random() * standardTextures.length);
    let randTexture = standardTextures[randNum];

    if (item.image) {
      randTexture = getImageUrl(item.image);
    }

    const texture = new THREE.TextureLoader().load(randTexture);

    let odysseyAvatarMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: texture
    });

    // Flip textures horizontally so text is readable.
    texture.wrapS = THREE.RepeatWrapping;
    //texture.repeat.x = - 1;

    const avatarMesh = new THREE.Mesh(odysseyAvatarGeometry, odysseyAvatarMaterial);

    const odyssey = new Odyssey(
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

  let meshArray = [];

  // TODO: Kovi
  // Scene setup
  //canvas = document.querySelector('.webgl');
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
  controls.maxDistance = MaxOrbitCameraDistance;
  controls.minDistance = minimalDistanceToPlanetForCamera;
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
    transparentA: true
  });

  /**
   * Build Galaxy
   */
  const parameters = {};
  parameters.count = 100000;
  parameters.size = 0.001;
  parameters.radius = 100;
  parameters.branches = 3;
  parameters.spin = 1.3;
  parameters.randomnes = 0.2;
  parameters.randomnesPower = 3;
  parameters.YHeight = 100;

  let pointsGeometry = null;
  let pointsMaterial = null;
  let points = null;

  const generateGalaxy = () => {
    /**
     * Clean previous renders of galaxy.
     */
    if (points !== null) {
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      scene.remove(points);
    }

    /**
     * Geometry
     */
    pointsGeometry = new THREE.BufferGeometry();
    const position = new Float32Array(parameters.count * 3);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), parameters.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), parameters.randomnesPower) *
        (Math.random() < 0.5 ? parameters.YHeight : -parameters.YHeight);
      const randomZ =
        Math.pow(Math.random(), parameters.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);

      position[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      position[i3 + 1] = randomY;
      position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    /**
     * Material
     */
    pointsMaterial = new THREE.PointsMaterial({
      size: parameters.size,
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

  //const axesHelper = new THREE.AxesHelper( 5 );
  //scene.add( axesHelper );

  generateGalaxy();

  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'radius').min(1).max(500).step(1).onFinishChange(generateGalaxy);
  gui.add(parameters, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy);
  gui.add(parameters, 'spin').min(-3).max(3).step(0.1).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomnes').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomnesPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'YHeight').min(1).max(150).step(1).onFinishChange(generateGalaxy);

  // update mouse location on screen
  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Onclick event

  function onMouseDown(event) {
    if (event.button != 0) {
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

      let targetVector = new THREE.Vector3();
      targetPlanet.object.getWorldPosition(targetVector);

      // FIXME: Kovi. Extract info from planet Kovi
      onOdysseyClick(targetPlanet.object.uuid);

      // Prepare fly to planets.
      const targetPlanetLocation = new Vector3(targetVector.x, targetVector.y, targetVector.z);

      // Prepare rotation of camera animation.
      const startOrientation = camera.quaternion.clone();
      const targetOrientation = camera.quaternion.clone(camera.lookAt(targetVector)).normalize();

      // Get the direction for the new location.
      let direction = new THREE.Vector3();
      direction.subVectors(targetVector, camera.position).normalize();

      // Get distance from raycast minus minimal distance orbit control
      // const distance = targetPlanet.distance - minimalDistanceToPlanetForCamera;
      let targetVectorForDistance = new Vector3(targetVector.x, targetVector.y, targetVector.z);
      const distance =
        targetVectorForDistance.distanceTo(camera.position) - minimalDistanceToPlanetForCamera;

      // Create new target for the camera.
      let targetLocation = new THREE.Vector3();
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
        listOfOddyseys.push(odyssey);
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
    let odysseyGroups = [];

    // Build circles in groups.
    function createRing() {
      // if amount to be spawned bigger than available odyssey
      if (listOfOddyseys.length < AmountOfOdysseyInNextRing) {
        AmountOfOdysseyInNextRing = listOfOddyseys.length;
      }

      let degreeBetweenOdyssey = 360 / AmountOfOdysseyInNextRing;
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
        if (planetAreSpawnedHorizontal) {
          newY = 0;
        } else {
          newY = Math.random() * planetsMaxVerticalSpawnHeight - planetsMaxVerticalSpawnHeight / 2;
        }
        const newZ = Math.sin(radian) * radius;

        currentOdyssey.position.set(newX, newY, newZ);

        currentOdyssey.randomConnection(AmountOfGalaxyToGenereate); // TEMP: Generate Random Connection in Class.

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

  /**
   * Highlight Mesh
   */

  /*
  const highlightGeometry = new THREE.PlaneGeometry(3,3);
  const highlightMateiral = new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.2});
  const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMateiral)
  highlightMesh.lookAt(camera.position);
  scene.add(highlightMesh);
  */

  /*
  function highlightObjects(){

      raycaster.setFromCamera(pointer, camera);

      const objectToHighlight = raycaster.intersectObjects(scene.children, true);

      if(objectToHighlight.length > 0){

          objectToHighlight.forEach( item => {
              if(item.object.isOdyssey && item.object !== selectedOdyssey){
                  highlightMesh.position .set(item.object.position.x, item.object.position.y, item.object.position.z)
              }
          })

       }
       // Update rotation of highlight plane to face camera.
       highlightMesh.lookAt(camera.position);
  }
  */

  /**
   * Handle fade out
   */

  // TEMPORAL TRIGGER FOR FADE OUT: SPACEBAR

  //window.addEventListener('keyup', event => {
  //    if(event.code === 'Space'){
  //        fadeOutScene();
  //    }
  //});

  function fadeOutScene() {
    // Add new DIV to the HTML for fadeOut

    const fadeOutDiv = document.createElement('div');
    fadeOutDiv.classList.add('fadeDiv');

    // Setup elemt style.
    fadeOutDiv.style.backgroundColor = 'black';
    fadeOutDiv.style.opacity = 0;
    fadeOutDiv.style.position = 'absolute';
    fadeOutDiv.style.width = '100vw';
    fadeOutDiv.style.height = '100vh';
    document.body.appendChild(fadeOutDiv);

    //Fade out  with interval
    const divToFade = document.querySelector('.fadeDiv');
    let fadeTimer = 0;

    // Setup interval
    const fadeOutTimer = setInterval(() => {
      // Check if timer is finished.
      if (fadeTimer >= 1) {
        clearInterval(fadeOutTimer);
      }

      fadeTimer += 0.01;
      divToFade.style.opacity = fadeTimer;
    }, 10);
  }

  // Animation
  function animate() {
    // Update Highlight
    //highlightObjects();

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

/* eslint-disable */
// @ts-nocheck

// FIXME: Refactoring !!! After 6th !!!

import gsap from 'gsap';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {MeshStandardMaterial, SphereGeometry, Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import baseAtmos from 'static/images/map/baseAtmos.png';
import temptations from 'static/images/map/temptations.png';
import showTime from 'static/images/map/showTime.png';
import honey01 from 'static/images/map/honey01.png';
import iceland01 from 'static/images/map/iceland01.png';
import BasicSkyboxHD from 'static/images/map/BasicSkyboxHD.png';

class Odyssey extends THREE.Mesh {
  private number: any;
  private wallet: any;
  private url: any;
  private isOdyssey: boolean;

  constructor(geometry: any, material: any, number: any, wallet: any, name: any, url: any) {
    super(geometry, material);

    this.material = material;
    this.geometry = geometry;
    this.name = name;

    this.number = number;
    this.wallet = wallet;
    this.url = url;
    this.isOdyssey = true;
  }

  connectedOdysseys: {id: number}[] = [];

  /**
   * Generating random Connection for vizualisation of connections.
   * DELETE THIS LATER.
   */
  randomConnection = (maxAmount: number) => {
    const amountToGenerate = 1; //Math.floor(Math.random() * 1);
    for (let i = 0; i < amountToGenerate; i++) {
      const object = {
        id: Math.floor(Math.random() * maxAmount)
      };
      this.connectedOdysseys.push(object);
    }
  };
}

let initialized = false;

export const use3DMap = (
  canvas: HTMLCanvasElement,
  onOdysseyClick: (id: string, name: string) => void
) => {
  // FIXME: Kovi
  if (!initialized) {
    initialized = true;
  } else {
    return;
  }

  const AmountOfGalaxyToGenereate = 200;
  const maxOdysseyConnectionLineHeight = 20;
  const MaxOrbitCameraDistance = 200;
  const planetAreSpawnedHorizontal = false;
  const planetsMaxVerticalSpawnHeight = 100;

  const createNewOdyssey = (id, wallet, name, url) => {
    const standardTextures = [baseAtmos, temptations, showTime, honey01, iceland01];

    const randNum = Math.floor(Math.random() * standardTextures.length);
    const texture = standardTextures[randNum];

    const geometry = new SphereGeometry(1, 16, 16);
    const material = new MeshStandardMaterial({
      map: new THREE.TextureLoader().load(texture)
    });

    const odyssey = new Odyssey(geometry, material, id, wallet, name, url);

    return odyssey;
  };

  let scene, renderer, controls;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const gui = new dat.GUI();
  gui.hide();

  let meshArray = [];

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
  renderer = new THREE.WebGLRenderer({canvas, antialias: true});
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
  controls.minDistance = 5;
  controls.zoomSpeed = 1;

  /**
   * Happyship skybox
   */
  const backgroundImage = new THREE.TextureLoader().load(BasicSkyboxHD);
  backgroundImage.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = backgroundImage;

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
    const castRay = raycaster.intersectObjects(scene.children, true);

    // Process the Raycast.
    if (castRay.length > 0) {
      let planetArray = [];
      // filter all planets from raycast.
      castRay.forEach((item) => {
        if (item.object.isOdyssey) {
          planetArray.push(item);
        }
      });

      // If the raycast holds zero planets. Exit method
      if (planetArray <= 0) {
        return;
      }

      // Only react to first raycast hit
      const targetPlanet = planetArray[0];

      console.log(targetPlanet);

      // FIXME: It doesn't work (Kovi)
      // Long information about selected Odyssey
      // targetPlanet.object.log();
      console.log(targetPlanet);

      // FIXME: Extract info from planet (Kovi)
      onOdysseyClick(targetPlanet.object.uuid, targetPlanet.object.name);

      // Prepare fly to planets.
      const targetPlanetLocation = new Vector3(
        targetPlanet.object.position.x,
        targetPlanet.object.position.y,
        targetPlanet.object.position.z
      );

      // Prepare rotation of camera animation.
      const startOrientation = camera.quaternion.clone();
      const targetOrientation = camera.quaternion
        .clone(camera.lookAt(targetPlanetLocation))
        .normalize();

      // Get the direction for the new location.
      let direction = new THREE.Vector3();
      direction.subVectors(targetPlanet.object.position, camera.position).normalize();

      // Get distance from raycast minus minimal distance orbit control
      const distance = targetPlanet.distance - 5;

      // Create new target for the camera.
      let targetLocation = new THREE.Vector3();
      targetLocation.addVectors(camera.position, direction.multiplyScalar(distance));

      // Animate using gsap module.
      gsap.to(camera.position, {
        duration: 1.5,
        x: targetLocation.x,
        y: targetLocation.y,
        z: targetLocation.z,
        onStart: function () {
          controls.enabled = false;
          controls.autoRotate = false;
          controls.enablePan = false;
        },
        onUpdate: function () {
          camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
          controls.update;
        },
        onComplete: function () {
          controls.enabled = true;
          controls.enablePan = true;
          controls.autoRotate = true;
          controls.target = targetPlanetLocation;
        }
      });
    }
  }

  const centerOdyssey = createNewOdyssey(122, 'Wallet Address', 'Frenkie world', 'test.com');
  scene.add(centerOdyssey);

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('mousedown', onMouseDown);

  /**
   * Create test array for odyssey
   */

  let listOfOddyseys = [];
  let referenceListOfOdysseys = [];

  const ProcessOdyssey = () => {
    const numberOfPlanets = AmountOfGalaxyToGenereate;

    //Build an odyssey for all given entries.
    for (let i = 0; i < numberOfPlanets; i++) {
      const odyssey = createNewOdyssey(i, 'Wallet Address', 'Frenkie world', 'test.com');
      listOfOddyseys.push(odyssey);
    }

    referenceListOfOdysseys = [...listOfOddyseys];
  };

  ProcessOdyssey();

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

    /**
     * Draw lines between staked Odysseys.
     */

    // setup reusable variables and material
    let vectorsForLine = [];
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    });

    referenceListOfOdysseys.forEach((odyssey) => {
      odyssey.connectedOdysseys.forEach((obj) => {
        vectorsForLine = []; //clean for next line.

        // Get positions from connected odyssey and draw line.
        const foundOdyssey = referenceListOfOdysseys.filter(
          (planet) => planet.number === obj.id
        )[0];

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
    });
  };

  buildUniverse();

  // Animation
  function animate() {
    // Render the scene
    renderer.render(scene, camera);

    // Update controls for auto-rotate.
    controls.update();

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

  return {onOdysseyClick};
};

/* eslint-disable */
// @ts-nocheck

/*

Project: Odyssey Explorer
Company: Odyssey B.V
Website: https://odyssey.org/
Author:  Frank Bloemendal

*/

import gsap from 'gsap';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
  CameraHelper,
  FrontSide,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  SphereGeometry,
  TextureLoader,
  Vector3
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import baseAtmos from 'static/images/map/baseAtmos.png';
import temptations from 'static/images/map/temptations.png';
import showTime from 'static/images/map/showTime.png';
import honey01 from 'static/images/map/honey01.png';
import iceland01 from 'static/images/map/iceland01.png';
import BasicSkyboxHD from 'static/images/map/BasicSkyboxHD.png';
import honey01HD from 'static/images/map/honey01HD.png';

import corona_ft from 'static/images/map/corona_ft.png';
import corona_bk from 'static/images/map/corona_bk.png';
import corona_up from 'static/images/map/corona_up.png';
import corona_dn from 'static/images/map/corona_dn.png';
import corona_rt from 'static/images/map/corona_rt.png';
import corona_lf from 'static/images/map/corona_lf.png';

let AmountOfGalaxyToGenereate = 200;

class Odyssey extends THREE.Mesh {
  constructor(geometry, material, number, wallet, name, url) {
    super(geometry, material);

    this.material = material;
    this.geometry = geometry;
    this.number = number;
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
    let amountToGenerate = Math.random() * 3;
    for (let i = 0; i < amountToGenerate; i++) {
      let object = {
        id: Math.floor(Math.random() * maxAmount)
      };
      this.connectedOdysseys.push(object);
    }
  };

  log = () => {
    console.log(
      'ID:' +
        this.number +
        ' Wallet:' +
        this.wallet +
        ' Webaddress:' +
        this.url +
        ' Connected: ' +
        this.connectedOdysseys
    );
  };
}

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

let scene, canvas, renderer, controls;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const gui = new dat.GUI();
gui.close();

let meshArray = [];

// Scene setup
canvas = document.querySelector('.webgl');
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
controls.maxDistance = 500;
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
parameters.YHeight = 5;

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

    // Long information about selected Odyssey
    targetPlanet.object.log();
    console.log(targetPlanet);

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
      },
      onUpdate: function () {
        camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
        controls.update;
      },
      onComplete: function () {
        controls.enabled = true;
        controls.autoRotate = true;
        controls.target = targetPlanetLocation;
      }
    });
  }
}

const testOdyssey = createNewOdyssey(122, 'Wallet Address', 'Frenkie world', 'test.com');
scene.add(testOdyssey);

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
      const newY = 0; //(Math.random() * 20) - 10;
      const newZ = Math.sin(radian) * radius;

      currentOdyssey.position.set(newX, newY, newZ);

      currentOdyssey.randomConnection(AmountOfGalaxyToGenereate); // TEMP: Generate Random Connection in Class.

      odysseyCircle.add(currentOdyssey);
    }

    listOfOddyseys.splice(0, AmountOfOdysseyInNextRing);

    radius += radiusIncreaseValue;
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
  const lineMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.15});

  referenceListOfOdysseys.forEach((odyssey) => {
    odyssey.connectedOdysseys.forEach((obj) => {
      vectorsForLine = []; //clean for next line.

      // Get positions from connected odyssey and draw line.
      const foundOdyssey = referenceListOfOdysseys.filter((planet) => planet.number === obj.id)[0];

      if (foundOdyssey) {
        vectorsForLine.push(odyssey.position, foundOdyssey.position);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(vectorsForLine);
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
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

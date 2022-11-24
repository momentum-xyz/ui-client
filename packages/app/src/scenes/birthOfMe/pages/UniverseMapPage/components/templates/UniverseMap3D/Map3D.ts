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

class Odyssey {
  constructor(id, name, wallet, url, texture) {
    this.id = id;
    this.name = name;
    this.wallet = wallet;
    this.url = url;
    this.texture = texture;

    // Set a base of random textures.
    const standardTextures = [baseAtmos, temptations, showTime, honey01, iceland01];

    // if no texture specified. Choose random texture.
    if (texture == null) {
      const randNum = Math.floor(Math.random() * standardTextures.length);
      this.texture = standardTextures[randNum];
    }

    // Build the sphere mesh.
    const geometry = new THREE.SphereGeometry(1, 20, 16);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(this.texture)
    });
    const Odyssey = new THREE.Mesh(geometry, material);
    Odyssey.name = 'journey';

    return Odyssey;
  }
}

let scene, canvas, renderer, controls;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const gui = new dat.GUI();

// Temporally hidden for show and tell
gui.hide();

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

// Create sun at the Center
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(4, 16, 16),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(honey01HD)
  })
);
//scene.add(sun);

/**
 * Build Galaxy
 */
const parameters = {};
parameters.count = 100000;
parameters.size = 0.001;
parameters.radius = 35;
parameters.branches = 3;
parameters.spin = 1.3;
parameters.randomnes = 0.2;
parameters.randomnesPower = 3;

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
      Math.pow(Math.random(), parameters.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnesPower) * (Math.random() < 0.5 ? 1 : -1);

    // const randomX = (Math.random() - 0.5) * parameters.randomnes
    // const randomY = (Math.random() - 0.5) * parameters.randomnes
    // const randomZ = (Math.random() - 0.5) * parameters.randomnes

    position[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; //(Math.random() - 0.5) * 5;
    position[i3 + 1] = randomY;
    position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //(Math.random() - 0.5) * 5;
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
    color: 0xff5588
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

// update mouse location on screen
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Onclick event
function onClick(event) {
  // Create Raycast
  raycaster.setFromCamera(pointer, camera);
  const castRay = raycaster.intersectObjects(scene.children, true);

  // Process the Raycast.
  if (castRay.length > 0) {
    castRay.forEach((item) => {
      if (item.object.name == 'journey') {
        // get new xyz for target and set new target for orbitcamera.
        const location = item.object.position;
        planetLocation = new Vector3(location.x, location.y, location.z);

        // Prepare rotation of camera animation.
        const startOrientation = camera.quaternion.clone();
        const targetOrientation = camera.quaternion
          .clone(camera.lookAt(planetLocation))
          .normalize();

        // Get the direction for the new location.
        let direction = new THREE.Vector3();
        direction.subVectors(item.object.position, camera.position).normalize();

        // Get distance from raycast minus minimal distance orbit control
        const distance = item.distance - 5;

        // Create new target location for Camera.
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
            controls.target = planetLocation;
          }
        });
      }
    });
  }
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);

// TEMP: SETUP DEV PLANETS>
function buildRandomUniverse() {
  const amountOfPlanets = 24;

  for (let i = 0; i < amountOfPlanets; i++) {
    const planetMesh = new Odyssey(
      0,
      "Frank's World",
      'WALLET_ADDRESS',
      'https://odyssey.org',
      null
    );
    meshArray.push(planetMesh);
  }

  meshArray.forEach((planet) => {
    planet.position.x = Math.random() * 45 - 20;
    planet.position.y = Math.random() * 3;
    planet.position.z = Math.random() * 45 - 20;

    planet.rotation.x = Math.random() * 2 * Math.PI;
    planet.rotation.y = Math.random() * 2 * Math.PI;
    planet.rotation.z = Math.random() * 2 * Math.PI;

    planet.name = 'journey';

    scene.add(planet);
  });
}

buildRandomUniverse();

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

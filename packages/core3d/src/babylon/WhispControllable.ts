import {
    ArcRotateCamera, Color3, Color4, Engine,
    KeyboardEventTypes, Mesh, MeshBuilder,
    PointerEventTypes,
    Scene, SolidParticleSystem, StandardMaterial, Texture,
    Vector2,
    Vector3
} from "@babylonjs/core";

import flare from "../static/Particles/flare.png";

import {Whisp} from "./Whisp";

interface KeyBindings {
    [key: string]: number
}

export class WhispControllable extends Whisp {
    private static readonly BIT_LEFT = 0x01;
    private static readonly BIT_RIGHT = 0x02;
    private static readonly BIT_FORWARD = 0x04;
    private static readonly BIT_BACK = 0x08;
    private static readonly BIT_DOWN = 0x10;
    private static readonly BIT_UP = 0x20;
    private static readonly BIT_SPRINT = 0x40;
    private static readonly BIT_LOOK = 0x80;
    private static readonly BITS_LOOK =
        WhispControllable.BIT_LOOK |
        WhispControllable.BIT_LEFT |
        WhispControllable.BIT_RIGHT |
        WhispControllable.BIT_FORWARD |
        WhispControllable.BIT_BACK |
        WhispControllable.BIT_UP |
        WhispControllable.BIT_DOWN;
    private static readonly BINDINGS: KeyBindings = {
        'a': WhispControllable.BIT_LEFT,
        'd': WhispControllable.BIT_RIGHT,
        'w': WhispControllable.BIT_FORWARD,
        's': WhispControllable.BIT_BACK,
        'q': WhispControllable.BIT_DOWN,
        'e': WhispControllable.BIT_UP,
        'shift': WhispControllable.BIT_SPRINT,
        ' ': WhispControllable.BIT_LOOK
    };
    private static readonly UP = new Vector3(0, 1, 0);
    private static readonly RIGHT = new Vector3(1, 0, 0);
    private static readonly FORWARD = new Vector3(0, 0, 1);
    private static readonly CAMERA_RAISE = 1.5;
    private static readonly CAMERA_RADIUS = 8;
    private static readonly CAMERA_SHAKE_MAGNITUDE = .0012;
    private static readonly CAMERA_SHAKE_SPRING = .004;
    private static readonly CAMERA_SHAKE_POWER = 1.2;
    private static readonly CAMERA_SPRING = .004;
    private static readonly ACCELERATION = 50;
    private static readonly ACCELERATION_SPRINT = 120;
    private static readonly FRICTION = .14;
    private static readonly LOOK_SENSITIVITY = .002;
    private static readonly STAR_SPAWN_DISTANCE = 9;
    private static readonly STAR_CLIP_DISTANCE = 13;
    private static readonly STAR_SPAWN_RADIUS = 5;
    private static readonly STAR_SCALE = .04;
    private static readonly STAR_STRETCH = 1.8;
    private static readonly STAR_COUNT = 80;
    private static readonly STAR_THRESHOLD = 4;
    private static readonly STAR_RAMP = .026031992;

    private readonly scene: Scene;
    private readonly cameraPosition = new Vector3();
    private readonly cameraOffset = new Vector3();
    private readonly cameraOffsetTarget = new Vector3();
    private readonly cameraUp = new Vector3();
    private readonly cursorMovement = new Vector2();

    private particlesStars?: SolidParticleSystem;
    private particlesStarsMesh?: Mesh;
    private particlesStarsMaterial?: StandardMaterial;
    private particlesStarsIntensity = 0;
    private looking = false;
    private camera;
    private cameraShake = 0;
    private inputState = 0;
    private inputStatePrevious = this.inputState;

    constructor(scene: Scene) {
        super(scene, true, true);

        this.addListeners(scene);

        this.scene = scene;
        this.camera = new ArcRotateCamera(
            "Camera",
            0,
            Math.PI * .5,
            WhispControllable.CAMERA_RADIUS,
            this.cameraPosition,
            scene);

        this.createParticlesBeams(scene);
        this.createParticlesSparks(scene);
        this.createParticlesStars(scene);
    }

    private createParticlesStars(scene: Scene) {
        const position = this.cameraPosition;
        const velocity = this.velocity;
        const direction = this.direction;
        const directionAngles = this.directionAngles;

        const makeParticleSpawn = (particlePosition: Vector3, initial = false) => {
            const tangent = direction.cross(WhispControllable.UP).normalize();
            const bitangent = direction.cross(tangent);
            const angle = Math.PI * 2 * Math.random();
            const radius = Math.sqrt(Math.random()) * WhispControllable.STAR_SPAWN_RADIUS;
            const distance = initial ?
                Math.random() * (WhispControllable.STAR_SPAWN_DISTANCE +
                    WhispControllable.STAR_CLIP_DISTANCE) -
                    WhispControllable.STAR_SPAWN_DISTANCE :
                WhispControllable.STAR_SPAWN_DISTANCE +
                    (WhispControllable.STAR_CLIP_DISTANCE -
                        WhispControllable.STAR_SPAWN_DISTANCE) * Math.random();

            particlePosition.x = position.x + direction.x * distance +
                Math.cos(angle) * tangent.x * radius +
                Math.sin(angle) * bitangent.x * radius;
            particlePosition.y = position.y + direction.y * distance +
                Math.cos(angle) * tangent.y * radius +
                Math.sin(angle) * bitangent.y * radius;
            particlePosition.z = position.z + direction.z * distance +
                Math.cos(angle) * tangent.z * radius +
                Math.sin(angle) * bitangent.z * radius;
        };

        this.particlesStars = new SolidParticleSystem("ParticlesStars", scene);
        this.particlesStars.addShape(MeshBuilder.CreatePlane("ParticlesStarsPlane", {

        }, scene), WhispControllable.STAR_COUNT);

        this.particlesStarsMesh = this.particlesStars.buildMesh();
        this.particlesStarsMaterial = new StandardMaterial("ParticlesStarsMaterial", scene);

        this.particlesStarsMaterial.opacityTexture = new Texture(flare);
        this.particlesStarsMaterial.alphaMode = Engine.ALPHA_ADD;
        this.particlesStarsMaterial.alpha = 0;
        this.particlesStarsMaterial.backFaceCulling = false;
        this.particlesStarsMaterial.disableLighting = true;
        this.particlesStarsMaterial.emissiveColor = new Color3(1, 1, 1);

        this.particlesStarsMesh.material = this.particlesStarsMaterial;
        this.particlesStarsMesh.alwaysSelectAsActiveMesh = true;

        this.particlesStars.initParticles = function() {
            for (let i = 0; i < this.nbParticles; ++i) {
                this.recycleParticle(this.particles[i]);

                makeParticleSpawn(this.particles[i].position, true);
            }
        };

        this.particlesStars.recycleParticle = function(particle) {
            makeParticleSpawn(particle.position);

            particle.scale.set(0, 0, 0);
            particle.color = new Color4(1, 1, 1, 1);

            return particle;
        };

        this.particlesStars.updateParticle = function(particle) {
            const dx = particle.position.x - position.x;
            const dy = particle.position.y - position.y;
            const dz = particle.position.z - position.z;
            const dot = direction.x * dx + direction.y * dy + direction.z * dz;
            const dcx = particle.position.x - position.x - dot * direction.x;
            const dcy = particle.position.y - position.y - dot * direction.y;
            const dcz = particle.position.z - position.z - dot * direction.z;

            if (dot < -WhispControllable.STAR_SPAWN_DISTANCE ||
                dcx * dcx + dcy * dcy + dcz * dcz >
                WhispControllable.STAR_SPAWN_RADIUS * WhispControllable.STAR_SPAWN_RADIUS) {
                this.recycleParticle(particle);
            }
            else {
                const visibility = Math.max(
                    0,
                    Math.cos(dot * (Math.PI * .5 / WhispControllable.STAR_SPAWN_DISTANCE)));
                const scale = visibility * WhispControllable.STAR_SCALE;

                particle.scale.set(
                    scale * (1 + velocity.length() * WhispControllable.STAR_STRETCH),
                    scale,
                    scale);

                particle.position.x -= velocity.x * scene.deltaTime * .001;
                particle.position.y -= velocity.y * scene.deltaTime * .001;
                particle.position.z -= velocity.z * scene.deltaTime * .001;
                particle.rotation.set(
                    directionAngles.x,
                    directionAngles.y,
                    directionAngles.z
                );
            }

            return particle;
        };

        this.particlesStars.isAlwaysVisible = true;
        this.particlesStars.initParticles();
    }

    private keyDown(key: string) {
        let bit;

        if ((bit = WhispControllable.BINDINGS[key])) {
            this.inputState |= bit;
        }
    }

    private keyUp(key: string) {
        let bit;

        if ((bit = WhispControllable.BINDINGS[key])) {
            this.inputState &= ~bit;
        }
    }

    private addListeners(scene: Scene) {
        scene.onKeyboardObservable.add((keyInfo) => {
            switch(keyInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.keyDown(keyInfo.event.key.toLowerCase());

                    if (keyInfo.event.key !== "Shift" && keyInfo.event.shiftKey) {
                        this.keyDown("Shift");
                    }

                    break;
                case KeyboardEventTypes.KEYUP:
                    this.keyUp(keyInfo.event.key.toLowerCase());

                    if (keyInfo.event.key !== "Shift" && keyInfo.event.shiftKey) {
                        this.keyUp("Shift");
                    }

                    break;
            }
        });

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERMOVE:
                    this.cursorMovement.x += pointerInfo.event.movementX;
                    this.cursorMovement.y += pointerInfo.event.movementY;

                    break;
            }
        });

        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement === scene.getEngine().getRenderingCanvas()) {
                this.startLooking();
            }
        });
    }

    private startLooking() {
        this.looking = true;
    }

    private stopLooking() {
        document.exitPointerLock();

        this.cursorMovement.set(0, 0);
        this.looking = false;
    }

    private updateCamera(delta: number) {
        if (this.looking) {
            const lookSpring = 1 - Math.pow(WhispControllable.CAMERA_SPRING, delta * 2);

            const dx = lookSpring * this.cursorMovement.x;
            const dy = lookSpring * this.cursorMovement.y;

            this.camera.alpha -= dx * WhispControllable.LOOK_SENSITIVITY;
            this.camera.beta -= dy * WhispControllable.LOOK_SENSITIVITY;

            this.cursorMovement.x -= dx;
            this.cursorMovement.y -= dy;
        }

        this.cameraPosition.x = this.position.x + Math.cos(Math.PI - this.camera.beta) *
            WhispControllable.CAMERA_RAISE * Math.cos(this.camera.alpha);
        this.cameraPosition.y = this.position.y + Math.sin(Math.PI - this.camera.beta) *
            WhispControllable.CAMERA_RAISE;
        this.cameraPosition.z = this.position.z + Math.cos(Math.PI - this.camera.beta) *
            WhispControllable.CAMERA_RAISE * Math.sin(this.camera.alpha);

        this.cameraOffsetTarget.set(
            (Math.random() * 2 - 1) * this.cameraShake,
            (Math.random() * 2 - 1) * this.cameraShake,
            (Math.random() * 2 - 1) * this.cameraShake);

        const spring = 1 - Math.pow(WhispControllable.CAMERA_SHAKE_SPRING, delta * 2);

        this.cameraOffset.x += (this.cameraOffsetTarget.x - this.cameraOffset.x) * spring;
        this.cameraOffset.y += (this.cameraOffsetTarget.y - this.cameraOffset.y) * spring;
        this.cameraOffset.z += (this.cameraOffsetTarget.z - this.cameraOffset.z) * spring;

        this.cameraPosition.x += this.cameraOffset.x;
        this.cameraPosition.y += this.cameraOffset.y;
        this.cameraPosition.z += this.cameraOffset.z;

        this.cameraUp.x = this.cameraOffset.x;
        this.cameraUp.y = this.cameraOffset.y + 1;
        this.cameraUp.z = this.cameraOffset.z;

        this.camera.upVector = this.cameraUp.normalize();
        this.camera.setTarget(this.cameraPosition);

        this.node.rotation.set(
            Math.PI * .5 - this.camera.beta,
            Math.PI * -.5 - this.camera.alpha,
            0);
        this.sphere.rotation.set(
            this.animationPhase * Math.PI * -2,
            -this.node.rotation.y,
            0);
    }

    update(delta: number) {
        if (this.inputState & WhispControllable.BITS_LOOK) {
            if (!(this.inputStatePrevious & WhispControllable.BITS_LOOK)) {
                this.scene.getEngine().getRenderingCanvas()?.requestPointerLock();
            }
        }
        else {
            this.stopLooking();
        }

        this.inputStatePrevious = this.inputState;

        const acceleration = (this.inputState & WhispControllable.BIT_SPRINT) ?
            WhispControllable.ACCELERATION_SPRINT * delta :
            WhispControllable.ACCELERATION * delta;

        const dx = (
            +((this.inputState & WhispControllable.BIT_RIGHT) === WhispControllable.BIT_RIGHT) -
            +((this.inputState & WhispControllable.BIT_LEFT) === WhispControllable.BIT_LEFT)) *
            acceleration;
        const dy = (
            +((this.inputState & WhispControllable.BIT_UP) === WhispControllable.BIT_UP) -
            +((this.inputState & WhispControllable.BIT_DOWN) === WhispControllable.BIT_DOWN)) *
            acceleration;
        const dz = (
            +((this.inputState & WhispControllable.BIT_FORWARD) === WhispControllable.BIT_FORWARD) -
            +((this.inputState & WhispControllable.BIT_BACK) === WhispControllable.BIT_BACK)) *
            acceleration;

        const right = this.camera.getDirection(WhispControllable.RIGHT);
        const forward = this.camera.getDirection(WhispControllable.FORWARD);

        this.velocity.x += forward.x * dz + WhispControllable.UP.x * dy + right.x * dx;
        this.velocity.y += forward.y * dz + WhispControllable.UP.y * dy + right.y * dx;
        this.velocity.z += forward.z * dz + WhispControllable.UP.z * dy + right.z * dx;

        this.cameraShake = Math.pow(
            this.velocity.length() * WhispControllable.CAMERA_SHAKE_MAGNITUDE,
            WhispControllable.CAMERA_SHAKE_POWER);

        const starsIntensityPrevious = this.particlesStarsIntensity;

        this.particlesStarsIntensity = Math.min(
            1,
            Math.max(0, this.velocity.length() - WhispControllable.STAR_THRESHOLD) *
                WhispControllable.STAR_RAMP);

        if (this.particlesStarsIntensity !== starsIntensityPrevious) {
            if (starsIntensityPrevious === 0) {
                this.particlesStarsMesh?.setEnabled(true);
            }
            else if (this.particlesStarsIntensity === 0) {
                this.particlesStarsMesh?.setEnabled(false);
            }
        }

        if (this.particlesStarsMaterial) {
            this.particlesStarsMaterial.alpha = this.particlesStarsIntensity;
        }

        const friction = Math.pow(WhispControllable.FRICTION, delta * 2);

        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.velocity.z *= friction;

        this.particlesStars?.setParticles();

        super.update(delta);

        this.updateCamera(delta);
    }
}
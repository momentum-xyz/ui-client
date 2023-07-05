/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ArcRotateCamera,
    KeyboardEventTypes,
    PointerEventTypes,
    Scene,
    TrailMesh,
    Vector2,
    Vector3
} from "@babylonjs/core";

import {Whisp} from "./Whisp";

interface Bindings {
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
    private static readonly BINDINGS: Bindings = {
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
    private static readonly ACCELERATION = 50;
    private static readonly ACCELERATION_SPRINT = 120;
    private static readonly FRICTION = .14;
    private static readonly LOOK_SENSITIVITY = .002;

    private readonly scene: Scene;
    private readonly velocity = new Vector3();
    private readonly cameraPosition = new Vector3();
    private readonly cameraOffset = new Vector3();
    private readonly cameraOffsetTarget = new Vector3();
    private readonly cameraUp = new Vector3();
    private readonly cursorMovement = new Vector2();

    private looking = false;
    private camera;
    private cameraShake = 0;
    private trail;
    private inputState = 0;
    private inputStatePrevious = this.inputState;

    constructor(scene: Scene) {
        super(scene, true);

        this.addListeners(scene);

        this.scene = scene;
        this.camera = new ArcRotateCamera(
            "Camera",
            0,
            Math.PI * .5,
            WhispControllable.CAMERA_RADIUS,
            this.cameraPosition,
            scene);
        this.trail = new TrailMesh("WhispTrail", this.sphere, scene, .1, 40);
        this.trail.start();

        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement === scene.getEngine().getRenderingCanvas()) {
                this.startLooking();
            }
        });
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
                case PointerEventTypes.POINTERDOWN:

                    break;
                case PointerEventTypes.POINTERUP:

                    break;
            }
        });
    }

    private startLook() {
        this.scene.getEngine().getRenderingCanvas()?.requestPointerLock();
    }

    private startLooking() {
        this.looking = true;
    }

    private stopLook() {
        document.exitPointerLock();

        this.looking = false;
    }

    private updateCamera(delta: number) {
        if (this.looking) {
            this.camera.alpha -= this.cursorMovement.x *
                WhispControllable.LOOK_SENSITIVITY;
            this.camera.beta -= this.cursorMovement.y *
                WhispControllable.LOOK_SENSITIVITY;
        }

        this.cursorMovement.set(0, 0);

        this.cameraPosition.x = this.position.x + WhispControllable.UP.x *
            WhispControllable.CAMERA_RAISE;
        this.cameraPosition.y = this.position.y + WhispControllable.UP.y *
            WhispControllable.CAMERA_RAISE;
        this.cameraPosition.z = this.position.z + WhispControllable.UP.z *
            WhispControllable.CAMERA_RAISE;

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
    }

    update(delta: number) {
        if (this.inputState & WhispControllable.BITS_LOOK) {
            if (!(this.inputStatePrevious & WhispControllable.BITS_LOOK)) {
                this.startLook();
            }
        }
        else {
            this.stopLook();
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

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;

        const friction = Math.pow(WhispControllable.FRICTION, delta * 2);

        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.velocity.z *= friction;

        super.update(delta);

        this.updateCamera(delta);
    }
}